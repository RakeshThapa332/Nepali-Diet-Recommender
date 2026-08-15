import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";

export default function Logs() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Logs & History"
        subtitle="Track your recommended and consumed meals."
      />
    </DashboardLayout>
  );
}