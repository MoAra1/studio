import { authorizer } from "../middleware";
import { validatePost } from "../middleware";
import { Request, RequestHandler, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import mung from "express-mung";
import tus from "tus-node-server";
import _ from "lodash";
import {
  makeNextHREF,
  parseFilters,
  parseOrder,
  getS3PresignedUrl,
  FieldsMap,
  toStringValues,
  pathJoin,
  getObjectStoreS3Config,
  reqUseReplica,
} from "./helpers";
import { db } from "../store";
import sql from "sql-template-strings";
import {
  ForbiddenError,
  UnprocessableEntityError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
  NotImplementedError,
  TooManyRequestsError,
} from "../store/errors";
import httpProxy from "http-proxy";
import { generateUniquePlaybackId } from "./generate-keys";
import {
  Asset,
  AssetPatchPayload,
  ExportTaskParams,
  IpfsFileInfo,
  NewAssetPayload,
  ObjectStore,
  Task,
} from "../schema/types";
import { WithID } from "../store/types";
import Queue from "../store/queue";
import taskScheduler from "../task/scheduler";
import { S3ClientConfig } from "@aws-sdk/client-s3";
import os from "os";
import { CliArgs } from "../parse-cli";

const app = Router();

function shouldUseCatalyst({ query, user, config }: Request) {
  const { vodCatalystPipelineRolloutPercent: rollPct } = config;
  const { email = "", admin } = user ?? {};
  const { upload } = toStringValues(query);

  if (email.startsWith("sas")) {
    // Special case for initial rollout
    return true;
  }
  if (email.endsWith("+e2e@livepeer.org") && rollPct < 100) {
    // force e2e tests to see 50% of each
    return 100 * Math.random() < 50;
  } else if (admin && upload) {
    // admin users can control what they see
    return upload === "1";
  } else if (
    email.endsWith("@livepeer.org") &&
    email !== "livepeerjs@livepeer.org"
  ) {
    // livepeer users only see catalyst
    return true;
  }
  // everyone else will see as much as we decide to rollout the catalyst pipeline
  return 100 * Math.random() < rollPct;
}

function defaultObjectStoreId(
  { config }: Request,
  useCatalyst: boolean
): string {
  if (!useCatalyst) {
    return config.vodObjectStoreId;
  }
  return config.vodCatalystObjectStoreId || config.vodObjectStoreId;
}

function cleanAssetTracks(asset: WithID<Asset>) {
  return !asset.videoSpec
    ? asset
    : {
        ...asset,
        videoSpec: {
          ...asset.videoSpec,
          tracks: undefined,
        },
      };
}

async function validateAssetPayload(
  id: string,
  playbackId: string,
  userId: string,
  createdAt: number,
  defaultObjectStoreId: string,
  payload: NewAssetPayload,
  source?: Asset["source"]
): Promise<WithID<Asset>> {
  if (payload.objectStoreId) {
    const os = await getActiveObjectStore(payload.objectStoreId);
    if (os.userId !== userId) {
      throw new ForbiddenError(
        `the provided object store is not owned by user`
      );
    }
  }

  return {
    id,
    playbackId,
    userId,
    createdAt,
    status: {
      phase: "waiting",
      updatedAt: createdAt,
    },
    name: payload.name,
    source:
      source ??
      (payload.url
        ? { type: "url", url: payload.url }
        : { type: "directUpload" }),
    playbackPolicy: payload.playbackPolicy,
    objectStoreId: payload.objectStoreId || defaultObjectStoreId,
  };
}

async function getActiveObjectStore(id: string) {
  const os = await db.objectStore.get(id);
  if (!os || os.deleted || os.disabled) {
    throw new Error("Object store not found or disabled");
  }
  return os;
}

export function getPlaybackUrl(
  { vodCatalystObjectStoreId }: Request["config"],
  ingest: string,
  asset: WithID<Asset>,
  os: ObjectStore
): string {
  if (asset.playbackRecordingId) {
    return pathJoin(
      ingest,
      "recordings",
      asset.playbackRecordingId,
      "index.m3u8"
    );
  }
  const catalystManifest = asset.files?.find(
    (f) => f.type === "catalyst_hls_manifest"
  );
  if (catalystManifest) {
    if (os.id !== vodCatalystObjectStoreId) {
      return pathJoin(os.publicUrl, asset.playbackId, catalystManifest.path);
    }
    // TODO: Set up Catalyst playback or a CDN in front of the default object store.
    return pathJoin(os.publicUrl, asset.playbackId, catalystManifest.path);
    // return pathJoin(
    //   "https://playback.livepeer.monster:10443/", // TODO: Make this a cli arg
    //   "hls",
    //   `asset+${asset.playbackId}`,
    //   "index.m3u8"
    // );
  }
  return undefined;
}

function getDownloadUrl(
  { vodObjectStoreId }: Request["config"],
  ingest: string,
  asset: WithID<Asset>,
  os: ObjectStore
): string {
  const base =
    os.id !== vodObjectStoreId ? os.publicUrl : pathJoin(ingest, "asset");
  const source = asset.files?.find((f) => f.type === "source_file");
  if (source) {
    return pathJoin(base, asset.playbackId, source.path);
  }
  return pathJoin(base, asset.playbackId, "video");
}

async function withPlaybackUrls(
  { config }: Request,
  ingest: string,
  asset: WithID<Asset>,
  os?: ObjectStore
): Promise<WithID<Asset>> {
  if (asset.status.phase !== "ready") {
    return asset;
  }
  os = os || (await getActiveObjectStore(asset.objectStoreId));
  return {
    ...asset,
    playbackUrl: getPlaybackUrl(config, ingest, asset, os),
    downloadUrl: getDownloadUrl(config, ingest, asset, os),
  };
}

export function withIpfsUrls<T extends Partial<IpfsFileInfo>>(
  gatewayUrl: string,
  ipfs: T
): T {
  if (!ipfs?.cid) {
    return ipfs;
  }
  return {
    ...ipfs,
    url: `ipfs://${ipfs.cid}`,
    gatewayUrl: pathJoin(gatewayUrl, ipfs.cid),
  };
}

function assetWithIpfsUrls(
  gatewayUrl: string,
  asset: WithID<Asset>
): WithID<Asset> {
  if (!asset?.storage?.ipfs?.cid) {
    return asset;
  }
  return _.merge({}, asset, {
    storage: {
      ipfs: {
        ...withIpfsUrls(gatewayUrl, asset.storage.ipfs),
        nftMetadata: withIpfsUrls(gatewayUrl, asset.storage.ipfs.nftMetadata),
      },
    },
  });
}

async function ensureQueueCapacity(config: CliArgs, userId: string) {
  const numScheduled = await db.task.countScheduledTasks(userId);
  if (numScheduled >= config.vodMaxScheduledTasksPerUser) {
    throw new TooManyRequestsError(
      `user ${userId} has reached the maximum number of pending tasks`
    );
  }
}

export async function createAsset(asset: WithID<Asset>, queue: Queue) {
  asset = await db.asset.create(asset);
  await queue.publishWebhook("events.asset.created", {
    type: "webhook_event",
    id: uuid(),
    timestamp: asset.createdAt,
    event: "asset.created",
    userId: asset.userId,
    payload: {
      asset: {
        id: asset.id,
        snapshot: asset,
      },
    },
  });
  return asset;
}

async function reconcileAssetStorage(
  { taskScheduler, config }: Request,
  asset: WithID<Asset>,
  newStorage: Asset["storage"],
  task?: WithID<Task>
): Promise<Asset["storage"]> {
  let { storage } = asset;
  const ipfsParamsEq = _.isEqual(
    newStorage.ipfs?.spec,
    storage?.ipfs?.spec ?? null
  );
  if ("ipfs" in newStorage && !ipfsParamsEq) {
    let newSpec = newStorage.ipfs?.spec;
    if (!newSpec) {
      throw new BadRequestError("Cannot remove asset from IPFS");
    }
    if (!task) {
      await ensureQueueCapacity(config, asset.userId);

      task = await taskScheduler.scheduleTask(
        "export",
        { export: { ipfs: newSpec } },
        asset
      );
    }
    storage = {
      ...storage,
      ipfs: {
        ...storage?.ipfs,
        spec: newSpec,
      },
      status: {
        phase: "waiting",
        tasks: {
          ...storage?.status?.tasks,
          pending: task.id,
        },
      },
    };
  }
  return storage;
}

async function genUploadUrl(
  playbackId: string,
  objectStoreId: string,
  jwtSecret: string,
  aud: string
) {
  const uploadedObjectKey = `directUpload/${playbackId}`;
  const os = await getActiveObjectStore(objectStoreId);

  const presignedUrl = await getS3PresignedUrl(os, uploadedObjectKey);
  const uploadToken = jwt.sign({ playbackId, presignedUrl, aud }, jwtSecret, {
    algorithm: "HS256",
  });

  const osPublicUrl = new URL(os.publicUrl);
  osPublicUrl.pathname = pathJoin(osPublicUrl.pathname, uploadedObjectKey);
  const downloadUrl = osPublicUrl.toString();

  return { uploadedObjectKey, uploadToken, downloadUrl };
}

function parseUploadUrl(
  signedUploadUrl: string,
  jwtSecret: string,
  audience: string
) {
  let urlJwt: JwtPayload;
  let uploadUrl: string;
  try {
    urlJwt = jwt.verify(signedUploadUrl, jwtSecret, {
      audience,
    }) as JwtPayload;
    uploadUrl = urlJwt.presignedUrl;
  } catch (err) {
    throw new ForbiddenError(`Invalid signed upload URL: ${err}`);
  }
  const { playbackId } = urlJwt;
  return { playbackId, uploadUrl };
}

app.use(
  mung.jsonAsync(async function cleanWriteOnlyResponses(
    data: WithID<Asset>[] | WithID<Asset> | { asset: WithID<Asset> },
    req
  ) {
    const { ipfsGatewayUrl } = req.config;
    const ingests = await req.getIngest();
    if (!ingests.length) {
      throw new InternalServerError("Ingest not configured");
    }
    const { details } = toStringValues(req.query);
    const ingest = ingests[0].base;
    let toExternalAsset = async (a: WithID<Asset>) => {
      a = await withPlaybackUrls(req, ingest, a);
      a = assetWithIpfsUrls(ipfsGatewayUrl, a);
      if (req.user.admin) {
        return a;
      }
      a = db.asset.cleanWriteOnlyResponse(a) as WithID<Asset>;
      if (!details) {
        a = cleanAssetTracks(a);
      }
      return a;
    };

    if (Array.isArray(data)) {
      return Promise.all(data.map(toExternalAsset));
    }
    if ("id" in data) {
      return toExternalAsset(data);
    }
    if ("asset" in data) {
      return {
        ...data,
        asset: await toExternalAsset(data.asset),
      };
    }
    return data;
  })
);

const fieldsMap: FieldsMap = {
  id: `asset.ID`,
  name: { val: `asset.data->>'name'`, type: "full-text" },
  objectStoreId: `asset.data->>'objectStoreId'`,
  createdAt: { val: `asset.data->'createdAt'`, type: "int" },
  updatedAt: { val: `asset.data->'status'->'updatedAt'`, type: "int" },
  userId: `asset.data->>'userId'`,
  playbackId: `asset.data->>'playbackId'`,
  playbackRecordingId: `asset.data->>'playbackRecordingId'`,
  phase: `asset.data->'status'->>'phase'`,
  "user.email": { val: `users.data->>'email'`, type: "full-text" },
  cid: `asset.data->'storage'->'ipfs'->>'cid'`,
  nftMetadataCid: `asset.data->'storage'->'ipfs'->'nftMetadata'->>'cid'`,
};

app.get("/", authorizer({}), async (req, res) => {
  let { limit, cursor, all, allUsers, order, filters, count, ...otherQs } =
    toStringValues(req.query);
  const fieldFilters = _.pick(otherQs, "playbackId", "cid", "nftMetadataCid");
  if (isNaN(parseInt(limit))) {
    limit = undefined;
  }
  if (!order) {
    order = "updatedAt-true,createdAt-true";
  }

  const query = [
    ...parseFilters(fieldsMap, filters),
    ...parseFilters(
      fieldsMap,
      JSON.stringify(_.map(fieldFilters, (v, k) => ({ id: k, value: v })))
    ),
  ];
  if (!req.user.admin || !all || all === "false") {
    query.push(sql`asset.data->>'deleted' IS NULL`);
  }

  let output: WithID<Asset>[];
  let newCursor: string;
  if (req.user.admin && allUsers && allUsers !== "false") {
    let fields =
      " asset.id as id, asset.data as data, users.id as usersId, users.data as usersdata";
    if (count) {
      fields = fields + ", count(*) OVER() AS count";
    }
    const from = `asset left join users on asset.data->>'userId' = users.id`;
    [output, newCursor] = await db.asset.find(query, {
      limit,
      cursor,
      fields,
      from,
      order: parseOrder(fieldsMap, order),
      process: ({ data, usersdata, count: c }) => {
        if (count) {
          res.set("X-Total-Count", c);
        }
        return {
          ...data,
          user: db.user.cleanWriteOnlyResponse(usersdata),
        };
      },
    });
  } else {
    query.push(sql`asset.data->>'userId' = ${req.user.id}`);

    let fields = " asset.id as id, asset.data as data";
    if (count) {
      fields = fields + ", count(*) OVER() AS count";
    }
    [output, newCursor] = await db.asset.find(query, {
      limit,
      cursor,
      fields,
      order: parseOrder(fieldsMap, order),
      process: ({ data, count: c }) => {
        if (count) {
          res.set("X-Total-Count", c);
        }
        return data;
      },
    });
  }

  res.status(200);
  if (output.length > 0 && newCursor) {
    res.links({ next: makeNextHREF(req, newCursor) });
  }

  return res.json(output);
});

app.get("/:id", authorizer({}), async (req, res) => {
  const asset = await db.asset.get(req.params.id, {
    useReplica: reqUseReplica(req),
  });
  if (!asset || asset.deleted) {
    throw new NotFoundError(`Asset not found`);
  }

  if (req.user.admin !== true && req.user.id !== asset.userId) {
    throw new ForbiddenError(
      "user can only request information on their own assets"
    );
  }

  res.json(asset);
});

app.post(
  "/:id/export",
  authorizer({}),
  validatePost("export-task-params"),
  async (req, res) => {
    const assetId = req.params.id;
    const asset = await db.asset.get(assetId);
    if (!asset) {
      throw new NotFoundError(`Asset not found with id ${assetId}`);
    }

    if (asset.status.phase !== "ready") {
      res.status(412);
      return res.json({ errors: ["asset is not ready to be exported"] });
    }
    if (req.user.id !== asset.userId) {
      throw new ForbiddenError(`User can only export their own assets`);
    }

    await ensureQueueCapacity(req.config, req.user.id);

    const params = req.body as ExportTaskParams;
    const task = await req.taskScheduler.scheduleTask(
      "export",
      { export: params },
      asset
    );

    if ("ipfs" in params && !params.ipfs?.pinata) {
      // TODO: Make this unsupported. PATCH should be the only way to change asset storage.
      console.warn(
        `Deprecated export to IPFS API used. userId=${req.user.id} assetId=${assetId}`
      );

      const storage = await reconcileAssetStorage(
        req,
        asset,
        { ipfs: { spec: params.ipfs } },
        task
      );
      await req.taskScheduler.updateAsset(asset, { storage });
    }

    res.status(201);
    res.json({ task });
  }
);

const uploadWithUrlHandler: RequestHandler = async (req, res) => {
  let { url, catalystPipelineStrategy } = req.body as NewAssetPayload;
  if (!req.user.admin && !req.user.isTestUser) {
    catalystPipelineStrategy = undefined;
  }
  if (!url) {
    return res.status(422).json({
      errors: [`Must provide a "url" field for the asset contents`],
    });
  }

  const id = uuid();
  const playbackId = await generateUniquePlaybackId(id);
  const useCatalyst = shouldUseCatalyst(req);
  const newAsset = await validateAssetPayload(
    id,
    playbackId,
    req.user.id,
    Date.now(),
    defaultObjectStoreId(req, useCatalyst),
    req.body
  );
  const dupAsset = await db.asset.findDuplicateUrlUpload(url, req.user.id);
  if (dupAsset) {
    const [task] = await db.task.find({ outputAssetId: dupAsset.id });
    if (!task.length) {
      console.error("Found asset with no task", dupAsset);
      // proceed as a regular new asset
    } else {
      // return the existing asset and task, as if created now, with a slightly
      // different status code (200, not 201). Should be transparent to clients.
      res.status(200).json({ asset: dupAsset, task: { id: task[0].id } });
      return;
    }
  }

  await ensureQueueCapacity(req.config, req.user.id);

  const asset = await createAsset(newAsset, req.queue);
  const taskType = useCatalyst ? "upload" : "import";
  const task = await req.taskScheduler.scheduleTask(
    taskType,
    {
      [taskType]: { url, catalystPipelineStrategy },
    },
    undefined,
    asset
  );

  res.status(201);
  res.json({ asset, task: { id: task.id } });
};

app.post(
  "/upload/url",
  authorizer({}),
  validatePost("new-asset-payload"),
  uploadWithUrlHandler
);
// TODO: Remove this at some point. Registered only for backward compatibility.
app.post(
  "/import",
  authorizer({}),
  validatePost("new-asset-payload"),
  uploadWithUrlHandler
);

// /:id/transcode and /transcode routes registered right below
const transcodeAssetHandler: RequestHandler = async (req, res) => {
  if (!req.params?.id && !req.body.assetId) {
    // called from the old `/api/asset/transcode` endpoint
    throw new BadRequestError(
      "Missing `assetId` payload field of the input asset"
    );
  }
  if (req.params?.id && req.body.assetId) {
    // called from the new `/api/asset/:assetId/transcode` endpoint
    throw new BadRequestError(
      "Field `assetId` is not allowed in payload when included in the URL"
    );
  }
  const assetId = req.params?.id || req.body.assetId;

  const inputAsset = await db.asset.get(assetId);
  if (!inputAsset) {
    throw new NotFoundError(`asset not found`);
  }

  const id = uuid();
  const playbackId = await generateUniquePlaybackId(id);
  let outputAsset = await validateAssetPayload(
    id,
    playbackId,
    req.user.id,
    Date.now(),
    defaultObjectStoreId(req, false), // transcode only in old pipeline for now
    {
      name: req.body.name ?? inputAsset.name,
    },
    { type: "transcode", inputAssetId: inputAsset.id }
  );
  outputAsset.sourceAssetId = inputAsset.sourceAssetId ?? inputAsset.id;

  await ensureQueueCapacity(req.config, req.user.id);

  outputAsset = await createAsset(outputAsset, req.queue);

  const task = await req.taskScheduler.scheduleTask(
    "transcode",
    {
      transcode: {
        profile: req.body.profile,
      },
    },
    inputAsset,
    outputAsset
  );
  res.status(201);
  res.json({ asset: outputAsset, task: { id: task.id } });
};
app.post(
  "/:id/transcode",
  authorizer({}),
  validatePost("transcode-asset-payload"),
  transcodeAssetHandler
);
// TODO: Remove this at some point. Registered only for backward compatibility.
app.post(
  "/transcode",
  authorizer({}),
  validatePost("transcode-asset-payload"),
  transcodeAssetHandler
);

app.post(
  "/request-upload",
  authorizer({}),
  validatePost("new-asset-payload"),
  async (req, res) => {
    const id = uuid();
    let playbackId = await generateUniquePlaybackId(id);

    const useCatalyst = shouldUseCatalyst(req);
    const { vodObjectStoreId, jwtSecret, jwtAudience } = req.config;
    let asset = await validateAssetPayload(
      id,
      playbackId,
      req.user.id,
      Date.now(),
      defaultObjectStoreId(req, useCatalyst),
      { name: `asset-upload-${id}`, ...req.body }
    );
    const { catalystPipelineStrategy = undefined } = req.user.admin
      ? (req.body as NewAssetPayload)
      : {};

    const { uploadToken, downloadUrl } = await genUploadUrl(
      playbackId,
      vodObjectStoreId,
      jwtSecret,
      jwtAudience
    );

    const ingests = await req.getIngest();
    if (!ingests.length) {
      res.status(501);
      return res.json({ errors: ["Ingest not configured"] });
    }
    const baseUrl = ingests[0].origin;
    const url = `${baseUrl}/api/asset/upload/direct?token=${uploadToken}`;
    const tusEndpoint = `${baseUrl}/api/asset/upload/tus?token=${uploadToken}`;

    // we check for enqueued tasks when starting an upload, but uploads
    // themselves don't count towards the limit. this should be relatvely fine
    // as direct uploads will also need a lot of effort from callers to upload
    // the files, so the risk is much smaller.
    await ensureQueueCapacity(req.config, req.user.id);

    asset = await createAsset(asset, req.queue);

    const taskType = shouldUseCatalyst(req) ? "upload" : "import";
    const task = await req.taskScheduler.spawnTask(
      taskType,
      {
        [taskType]: { url: downloadUrl, catalystPipelineStrategy },
      },
      null,
      asset
    );

    res.json({ url, tusEndpoint, asset, task: { id: task.id } });
  }
);

let tusServer: tus.Server;

export const setupTus = async (objectStoreId: string): Promise<void> => {
  tusServer = await createTusServer(objectStoreId);
};

async function createTusServer(objectStoreId: string) {
  const os = await getActiveObjectStore(objectStoreId);
  const s3config = await getObjectStoreS3Config(os);
  const opts: tus.S3StoreOptions & S3ClientConfig = {
    ...s3config,
    path: "/upload/tus",
    partSize: 8 * 1024 * 1024,
    tmpDirPrefix: "tus-tmp-files",
    namingFunction,
  };
  const tusServer = new tus.Server();
  tusServer.datastore = new tus.S3Store(opts);
  tusServer.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, onTusUploadComplete(false));
  return tusServer;
}

export const setupTestTus = async (): Promise<void> => {
  tusServer = await createTestTusServer();
};

async function createTestTusServer() {
  const tusTestServer = new tus.Server();
  tusTestServer.datastore = new tus.FileStore({
    path: "/upload/tus",
    directory: os.tmpdir(),
    namingFunction: (req: Request) =>
      req.res.getHeader("livepeer-playback-id").toString(),
  });
  tusTestServer.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, onTusUploadComplete(true));
  return tusTestServer;
}

const namingFunction = (req: Request) => {
  const playbackId = req.res.getHeader("livepeer-playback-id").toString();
  if (!playbackId) {
    throw new InternalServerError("Missing playbackId in response headers");
  }
  return `directUpload/${playbackId}`;
};

type TusFileMetadata = {
  id: string;
  upload_length: `${number}`;
  upload_metadata: string;
};

const onTusUploadComplete =
  (isTest: boolean) =>
  async ({ file }: { file: TusFileMetadata }) => {
    try {
      const playbackId = isTest ? file.id : file.id.split("/")[1]; // `directUpload/${playbackId}`
      const { task } = await getPendingAssetAndTask(playbackId);
      await taskScheduler.enqueueTask(task);
    } catch (err) {
      console.error(
        `error processing finished upload fileId=${file.id} err=`,
        err
      );
    }
  };

const getPendingAssetAndTask = async (playbackId: string) => {
  const asset = await db.asset.getByPlaybackId(playbackId, {
    useReplica: false,
  });
  if (!asset) {
    throw new NotFoundError(`asset not found`);
  } else if (asset.status.phase !== "waiting") {
    throw new UnprocessableEntityError(`asset has already been uploaded`);
  }

  const tasks = await db.task.find(
    { outputAssetId: asset.id },
    { useReplica: false }
  );
  if (!tasks?.length || !tasks[0]?.length) {
    throw new NotFoundError(`task not found`);
  }
  const task = tasks[0][0];
  if (task.status?.phase !== "pending") {
    throw new UnprocessableEntityError(`asset has already been uploaded`);
  }
  return { asset, task };
};

app.use("/upload/tus/*", async (req, res, next) => {
  if (!tusServer) {
    throw new NotImplementedError("Tus server not configured");
  }
  return next();
});

app.post("/upload/tus", async (req, res) => {
  const uploadToken = req.query.token?.toString();
  if (!uploadToken) {
    throw new UnauthorizedError(
      "Missing uploadToken metadata from /request-upload API"
    );
  }

  const { jwtSecret, jwtAudience } = req.config;
  const { playbackId } = parseUploadUrl(uploadToken, jwtSecret, jwtAudience);
  await getPendingAssetAndTask(playbackId);
  // TODO: Consider updating asset name from metadata?
  res.setHeader("livepeer-playback-id", playbackId);
  return tusServer.handle(req, res);
});

app.all("/upload/tus/*", (req, res) => {
  return tusServer.handle(req, res);
});

app.put("/upload/direct", async (req, res) => {
  const {
    query: { token },
    config: { jwtSecret, jwtAudience },
  } = req;
  const { uploadUrl, playbackId } = parseUploadUrl(
    token?.toString(),
    jwtSecret,
    jwtAudience
  );

  const { task } = await getPendingAssetAndTask(playbackId);
  var proxy = httpProxy.createProxyServer({});
  proxy.on("end", async function (proxyReq, _, res) {
    if (res.statusCode == 200) {
      // TODO: Find a way to return the task in the response
      await req.taskScheduler.enqueueTask(task);
    } else {
      console.log(
        `assetUpload: Proxy upload to s3 on url ${uploadUrl} failed with status code: ${res.statusCode}`
      );
    }
  });

  proxy.web(req, res, {
    target: uploadUrl,
    changeOrigin: true,
    ignorePath: true,
  });
});

app.delete("/:id", authorizer({}), async (req, res) => {
  const { id } = req.params;
  const asset = await db.asset.get(id);
  if (!asset) {
    throw new NotFoundError(`Asset not found`);
  }
  if (!req.user.admin && req.user.id !== asset.userId) {
    throw new ForbiddenError(`users may only delete their own assets`);
  }
  await req.taskScheduler.deleteAsset(asset);
  res.status(204);
  res.end();
});

app.patch(
  "/:id",
  authorizer({}),
  validatePost("asset-patch-payload"),
  async (req, res) => {
    // these are the only updateable fields
    let {
      name,
      playbackPolicy,
      storage: storageInput,
    } = req.body as AssetPatchPayload;

    let storage: Asset["storage"];
    if (storageInput?.ipfs !== undefined) {
      let { ipfs } = storageInput;
      if (typeof ipfs === "boolean" || !ipfs) {
        ipfs = { spec: ipfs ? {} : null };
      } else if (typeof ipfs.spec === "undefined") {
        ipfs = { spec: {} };
      }
      storage = { ...storageInput, ipfs };
    }

    // update a specific asset
    const { id } = req.params;
    const asset = await db.asset.get(id);
    if (!asset || (asset.userId !== req.user.id && !req.user.admin)) {
      throw new NotFoundError(`asset not found`);
    } else if (asset.status.phase !== "ready") {
      throw new UnprocessableEntityError(`asset is not ready`);
    }

    if (storage) {
      storage = await reconcileAssetStorage(req, asset, storage);
    }

    await req.taskScheduler.updateAsset(asset, {
      name,
      storage,
      playbackPolicy,
    });
    const updated = await db.asset.get(id, { useReplica: false });
    res.status(200).json(updated);
  }
);

export default app;
