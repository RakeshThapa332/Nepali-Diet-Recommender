import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";

export default function Profile() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Profile"
        subtitle="View and manage your personal and nutritional information."
      />
    </DashboardLayout>
  );
}