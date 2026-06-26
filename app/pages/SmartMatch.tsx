import { PageHeader } from "../components/PageHeader";
import { Zap, Sparkles } from "lucide-react";
import { Card } from "../components/ui/card";
import { mockStaff } from "../data/mockData";

export default function SmartMatch() {
  return (
    <div className="space-y-5">
      <PageHeader module="OPERATIONS" title="Smart Match" subtitle="AI-powered staff matching" icon={Zap} />
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-base font-semibold text-[#1B3569]">AI Recommendations</h3>
        </div>
        <div className="space-y-3">
          {mockStaff.map(staff => (
            <div key={staff.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div>
                <p className="text-sm font-semibold text-[#1B3569]">{staff.name}</p>
                <p className="text-xs text-[#888]">{staff.role} · {staff.yearsExperience} years · {staff.skills.join(', ')}</p>
              </div>
              <span className="text-sm font-bold text-purple-600">{Math.floor(Math.random() * 30 + 70)}% Match</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
