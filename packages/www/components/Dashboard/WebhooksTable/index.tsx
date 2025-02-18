import { useCallback, useMemo } from "react";
import { useApi } from "../../../hooks";
import Table, { Fetcher, useTableState } from "components/Dashboard/Table";
import { Box } from "@livepeer/design-system";
import { useToggleState } from "hooks/use-toggle-state";
import CreateDialog, {
  Action,
} from "components/Dashboard/WebhookDialogs/CreateEditDialog";
import { useRouter } from "next/router";
import {
  makeColumns,
  makeEmptyState,
  rowsPageFromState,
  WebhooksTableData,
} from "./helpers";
import { makeCreateAction, makeSelectAction } from "../Table/helpers";
import TableStateDeleteDialog from "../Table/components/TableStateDeleteDialog";

const WebhooksTable = ({ title = "Webhooks" }: { title?: string }) => {
  const router = useRouter();
  const { user, getWebhooks, createWebhook, deleteWebhook, deleteWebhooks } =
    useApi();
  const deleteDialogState = useToggleState();
  const createDialogState = useToggleState();
  const { state, stateSetter } = useTableState<WebhooksTableData>({
    tableId: "webhooksTable",
  });

  const columns = useMemo(makeColumns, []);

  const fetcher: Fetcher<WebhooksTableData> = useCallback(
    async (state) => rowsPageFromState(state, getWebhooks),
    [getWebhooks, user.id]
  );

  const onCreateSubmit = async ({ events, name, url, sharedSecret }) => {
    const newWebhook = await createWebhook({
      events,
      name,
      url,
      sharedSecret,
    });
    await state.invalidate();
    const query = router.query.admin === "true" ? { admin: true } : {};
    await router.push({
      pathname: `/dashboard/developers/webhooks/${newWebhook.id}`,
      query,
    });
  };

  return (
    <Box css={{ p: "$6", mb: "$8" }}>
      <Table
        title={title}
        columns={columns}
        fetcher={fetcher}
        state={state}
        stateSetter={stateSetter}
        rowSelection="all"
        emptyState={makeEmptyState(createDialogState)}
        selectAction={makeSelectAction("Delete", deleteDialogState.onOn)}
        createAction={makeCreateAction(
          "Create webhook",
          createDialogState.onOn
        )}
      />

      <TableStateDeleteDialog
        entityName={{ singular: "webhook", plural: "webhooks" }}
        state={state}
        dialogToggleState={deleteDialogState}
        deleteFunction={deleteWebhook}
        deleteMultipleFunction={deleteWebhooks}
      />

      <CreateDialog
        action={Action.Create}
        isOpen={createDialogState.on}
        onOpenChange={createDialogState.onToggle}
        onSubmit={onCreateSubmit}
      />
    </Box>
  );
};

export default WebhooksTable;
