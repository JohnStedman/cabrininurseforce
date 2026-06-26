import { PageHeader } from "../components/PageHeader";
import { Clock } from "lucide-react";
import { Card } from "../components/ui/card";

export default function Timesheets() {
  return (
    <div className="space-y-5">
      <PageHeader module="EXECUTION" title="Timesheets" subtitle="Time tracking and approvals" icon={Clock} />
      <Card className="p-8">
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1B3569] mb-2">Timesheets</h3>
          <p className="text-sm text-[#888]">Timesheet management and approval workflows coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
