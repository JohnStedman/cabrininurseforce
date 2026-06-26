import { PageHeader } from "../components/PageHeader";
import { Settings } from "lucide-react";
import { Card } from "../components/ui/card";
import { DatabaseStatus } from "../components/DatabaseStatus";

export default function Admin() {
  return (
    <div className="space-y-5">
      <PageHeader module="SYSTEM" title="Admin" subtitle="System administration and settings" icon={Settings} />
      <div className="grid gap-4">
        <DatabaseStatus />
        <Card className="p-8">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1B3569] mb-2">Administration</h3>
            <p className="text-sm text-[#888]">System settings and configuration coming soon.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
