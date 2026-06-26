import { PageHeader } from "../components/PageHeader";
import { MessageSquare } from "lucide-react";
import { Card } from "../components/ui/card";

export default function Communications() {
  return (
    <div className="space-y-5">
      <PageHeader module="OPERATIONS" title="Communications" subtitle="Staff messaging and notifications" icon={MessageSquare} />
      <Card className="p-8">
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-[#1565C0]/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1B3569] mb-2">Communications</h3>
          <p className="text-sm text-[#888]">Communication tools and messaging coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
