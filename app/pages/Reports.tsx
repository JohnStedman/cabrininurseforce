import { PageHeader } from "../components/PageHeader";
import { FileText } from "lucide-react";
import { Card } from "../components/ui/card";

export default function Reports() {
  return (
    <div className="space-y-5">
      <PageHeader module="FINANCIAL" title="Reports" subtitle="Analytics and insights" icon={FileText} />
      <Card className="p-8">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1B3569] mb-2">Reports</h3>
          <p className="text-sm text-[#888]">Reporting and analytics dashboard coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
