import { PageHeader } from "../components/PageHeader";
import { ClipboardList } from "lucide-react";
import { Card } from "../components/ui/card";

export default function AuditLog() {
  return (
    <div className="space-y-5">
      <PageHeader module="SYSTEM" title="Audit Log" subtitle="System activity and audit trail" icon={ClipboardList} />
      <Card className="p-8">
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1B3569] mb-2">Audit Log</h3>
          <p className="text-sm text-[#888]">Complete system audit trail coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
