import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";

export default function Settings() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        subtitle="Manage your application preferences."
      />
    </DashboardLayout>
  );
}