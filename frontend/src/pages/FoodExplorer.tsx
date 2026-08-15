import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";

export default function FoodExplorer() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Food Explorer"
        subtitle="Explore nutritional information from the Nepali food database."
      />
    </DashboardLayout>
  );
}