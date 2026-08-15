import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";

export default function Progress() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Progress"
        subtitle="Track your nutrition and progress toward your goal."
      />
    </DashboardLayout>
  );
}