import sql from "sql-template-strings";
import { Asset, Task } from "../schema/types";
import Table from "./table";
import { QueryOptions, WithID } from "./types";

const DUPLICATE_ASSETS_THRESHOLD = 15 * 60 * 1000; // 15 mins

export const taskOutputToIpfsStorage = (
  out: Task["output"]["export"]["ipfs"]
): Omit<Asset["storage"]["ipfs"], "spec"> =>
  !out
    ? null
    : {
        cid: out.videoFileCid,
        url: out.videoFileUrl,
        gatewayUrl: out.videoFileGatewayUrl,
        nftMetadata: !out.nftMetadataCid
          ? undefined
          : {
              cid: out.nftMetadataCid,
              url: out.nftMetadataUrl,
              gatewayUrl: out.nftMetadataGatewayUrl,
            },
      };

export default class AssetTable extends Table<WithID<Asset>> {
  async getByPlaybackId(
    playbackId: string,
    opts?: QueryOptions
  ): Promise<WithID<Asset>> {
    const query = [
      sql`asset.data->>'playbackId' = ${playbackId}`,
      sql`asset.data->>'deleted' IS NULL`,
    ];
    const [assets] = await this.find(query, {
      ...opts,
      limit: 2,
    });
    if (assets.length < 1) {
      return null;
    }
    return assets[0];
  }

  async getByIpfsCid(cid: string): Promise<WithID<Asset>> {
    const query = [
      sql`asset.data->'storage'->'ipfs'->>'cid' = ${cid}`,
      sql`asset.data->>'deleted' IS NULL`,
    ];
    const [assets] = await this.find(query, {
      limit: 2,
      order: "coalesce((asset.data->'createdAt')::bigint, 0) ASC",
    });
    if (!assets || assets.length < 1) {
      return null;
    }
    return assets[0];
  }

  async getBySourceURL(url: string): Promise<WithID<Asset>> {
    const query = [
      sql`asset.data->'source'->>'type' = 'url'`,
      sql`asset.data->'source'->>'url' = ${url}`,
      sql`asset.data->>'deleted' IS NULL`,
      sql`asset.data->'status'->>'phase' = 'ready'`,
    ];
    const [assets] = await this.find(query, {
      limit: 2,
      order: "coalesce((asset.data->'createdAt')::bigint, 0) ASC",
    });
    if (!assets || assets.length < 1) {
      return null;
    }
    return assets[0];
  }

  async findDuplicateUrlUpload(
    url: string,
    userId: string
  ): Promise<WithID<Asset>> {
    const createdAfter = Date.now() - DUPLICATE_ASSETS_THRESHOLD;
    const query = [
      sql`asset.data->>'deleted' IS NULL`,
      sql`asset.data->>'userId' = ${userId}`,
      sql`asset.data->'source'->>'type' = 'url'`,
      sql`asset.data->'source'->>'url' = ${url}`,
      sql`asset.data->'status'->>'phase' IN ('waiting', 'processing')`,
      sql`coalesce((asset.data->>'createdAt')::bigint, 0) > ${createdAfter}`,
    ];
    const [assets] = await this.find(query, { limit: 1 });
    return assets?.length > 0 ? assets[0] : null;
  }
}
