import { PageHeader } from "../components/PageHeader";
import { Shield } from "lucide-react";
import { Card } from "../components/ui/card";
import { mockStaff } from "../data/mockData";

export default function Compliance() {
  const expiring = mockStaff.filter(s => s.complianceStatus !== 'Current');
  return (
    <div className="space-y-5">
      <PageHeader module="COMPLIANCE" title="Compliance & Credentialing" subtitle="Track AHPRA and credentials" icon={Shield} />
      <Card className="p-5">
        <h3 className="text-base font-semibold text-[#1B3569] mb-4">Compliance Overview</h3>
        <div className="space-y-2">
          {mockStaff.map(staff => (
            <div key={staff.id} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-lg border border-black/[0.05]">
              <div>
                <p className="text-sm font-semibold text-[#1B3569]">{staff.name}</p>
                <p className="text-xs text-[#888]">AHPRA: {staff.ahpraRegistration}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${staff.complianceStatus === 'Current' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>{staff.complianceStatus}</span>
            </div>
          ))}
        </div>
        {expiring.length > 0 && (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-sm font-semibold text-orange-800">{expiring.length} staff with expiring credentials</p>
          </div>
        )}
      </Card>
    </div>
  );
}
