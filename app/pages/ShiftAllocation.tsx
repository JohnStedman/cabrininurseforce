import { PageHeader } from "../components/PageHeader";
import { Calendar } from "lucide-react";
import { Card } from "../components/ui/card";
import { getShifts } from "../data/shiftStore";
import { Badge } from "../components/ui/badge";

export default function ShiftAllocation() {
  const shifts = getShifts();
  const unfilled = shifts.filter(s => s.status === 'Unfilled');

  return (
    <div className="space-y-5">
      <PageHeader module="OPERATIONS" title="Shift Allocation" subtitle="Manage shifts and rosters" icon={Calendar} />
      <Card className="p-5">
        <h3 className="text-base font-semibold text-[#1B3569] mb-4">Shift Overview</h3>
        <div className="space-y-2">
          {shifts.map(shift => (
            <div key={shift.id} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-lg border border-black/[0.05]">
              <div>
                <p className="text-sm font-semibold text-[#1B3569]">{shift.ward} · {shift.facility}</p>
                <p className="text-xs text-[#888]">{shift.date} · {shift.startTime}–{shift.endTime} · {shift.role}</p>
              </div>
              <Badge className={shift.status === 'Filled' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                {shift.status}
              </Badge>
            </div>
          ))}
        </div>
        {unfilled.length > 0 && (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-sm font-semibold text-orange-800">{unfilled.length} unfilled shifts require attention</p>
          </div>
        )}
      </Card>
    </div>
  );
}
