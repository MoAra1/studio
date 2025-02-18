import Layout from "layouts/dashboard";
import { Box } from "@livepeer/design-system";
import { useApi, useLoggedIn } from "hooks";
import StreamSessionsTable from "components/Dashboard/StreamSessionsTable";

const Sessions = () => {
  useLoggedIn();
  const { user } = useApi();

  if (!user) {
    return <Layout />;
  }

  return (
    <Layout id="streams/sessions" breadcrumbs={[{ title: "Sessions" }]}>
      <Box
        css={{
          pb: "$9",
          px: "$6",
          pt: "$6",
          "@bp4": {
            p: "$6",
          },
        }}>
        <StreamSessionsTable />
      </Box>
    </Layout>
  );
};

export default Sessions;
