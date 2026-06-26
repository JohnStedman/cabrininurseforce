import { PageHeader } from "../components/PageHeader";
import { BookOpen } from "lucide-react";
import { Card } from "../components/ui/card";

export default function UserManual() {
  return (
    <div className="space-y-5">
      <PageHeader module="SYSTEM" title="User Manual" subtitle="NurseForce documentation and help" icon={BookOpen} />
      <Card className="p-8">
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1B3569] mb-2">User Manual</h3>
          <p className="text-sm text-[#888]">Comprehensive documentation and training materials coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
