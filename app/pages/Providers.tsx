import { PageHeader } from "../components/PageHeader";
import { Building2 } from "lucide-react";
import { Card } from "../components/ui/card";
import { mockProviders } from "../data/mockData";

export default function Providers() {
  return (
    <div className="space-y-5">
      <PageHeader module="PROVIDERS" title="Provider Network" subtitle="Manage agency providers and contractors" icon={Building2} />
      <Card className="p-5">
        <div className="space-y-3">
          {mockProviders.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-lg border border-black/[0.05]">
              <div>
                <p className="text-sm font-semibold text-[#1B3569]">{p.name}</p>
                <p className="text-xs text-[#888]">Tier {p.priorityTier} · {p.contractorCount} contractors · {p.status}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Tier {p.priorityTier}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}