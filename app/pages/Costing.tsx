import { PageHeader } from "../components/PageHeader";
import { DollarSign } from "lucide-react";
import { Card } from "../components/ui/card";

export default function Costing() {
  return (
    <div className="space-y-5">
      <PageHeader module="FINANCIAL" title="Costing & Budgeting" subtitle="Workforce cost management and budgeting" icon={DollarSign} />
      <Card className="p-8">
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1B3569] mb-2">Costing</h3>
          <p className="text-sm text-[#888]">Cost analysis and budgeting tools coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
