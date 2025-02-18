import Layout from "layouts/dashboard";
import { useApi, useLoggedIn } from "hooks";
import WebhooksTable from "components/Dashboard/WebhooksTable";

const Webhooks = () => {
  useLoggedIn();
  const { user } = useApi();

  if (!user) {
    return <Layout />;
  }

  return (
    <Layout
      id="developers/webhooks"
      breadcrumbs={[
        { title: "Developers", href: "/dashboard/developers/webhooks" },
        { title: "Webhooks" },
      ]}>
      <WebhooksTable />
    </Layout>
  );
};

export default Webhooks;
