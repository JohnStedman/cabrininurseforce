import { PageHeader } from "../components/PageHeader";
import { Briefcase } from "lucide-react";
import { Card } from "../components/ui/card";

export default function AgencyDashboard() {
  return (
    <div className="space-y-5">
      <PageHeader module="AGENCY" title="Agency Dashboard" subtitle="External agency portal view" icon={Briefcase} />
      <Card className="p-8">
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1B3569] mb-2">Agency Portal</h3>
          <p className="text-sm text-[#888]">Agency-specific dashboard coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
