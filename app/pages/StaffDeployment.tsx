import { PageHeader } from "../components/PageHeader";
import { MapPin } from "lucide-react";
import { Card } from "../components/ui/card";

export default function StaffDeployment() {
  return (
    <div className="space-y-5">
      <PageHeader module="OPERATIONS" title="Staff Deployment" subtitle="Live workforce deployment across all locations" icon={MapPin} />
      <Card className="p-8">
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1B3569] mb-2">Deployment Map</h3>
          <p className="text-sm text-[#888]">Interactive staff deployment visualization coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
