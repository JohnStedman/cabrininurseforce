import { PageHeader } from "../components/PageHeader";
import { Users, Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { mockStaff } from "../data/mockData";
import { useState } from "react";

export default function StaffManagement() {
  const [search, setSearch] = useState('');
  const filtered = mockStaff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <PageHeader module="WORKFORCE" title="Staff Management" subtitle="Manage all staff across the organisation" icon={Users} />
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-[#888]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <div className="space-y-2">
          {filtered.map(staff => (
            <div key={staff.id} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-lg border border-black/[0.05]">
              <div>
                <p className="text-sm font-semibold text-[#1B3569]">{staff.name}</p>
                <p className="text-xs text-[#888]">{staff.role} · {staff.status} · {staff.yearsExperience} years exp</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${staff.complianceStatus === 'Current' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>{staff.complianceStatus}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
