import { PageHeader } from "../components/PageHeader";
import { MetricCard } from "../components/MetricCard";
import { Card } from "../components/ui/card";
import { LayoutDashboard, Calendar, Users, TriangleAlert as AlertTriangle, TrendingUp, DollarSign, Clock, Building2, Sparkles, CircleCheck as CheckCircle, Circle as XCircle } from "lucide-react";
import { getShifts } from "../data/shiftStore";
import { mockStaff } from "../data/mockData";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const shifts = getShifts();
  const unfilled = shifts.filter(s => s.status === 'Unfilled');
  const filled = shifts.filter(s => s.status === 'Filled');
  const availableStaff = mockStaff.filter(s => s.status === 'Available');

  return (
    <div className="space-y-5">
      <PageHeader
        module="OPERATIONS"
        title="Dashboard"
        subtitle="Real-time workforce overview for Cabrini"
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Today's Shifts" value={shifts.length.toString()} change={`${filled.length} filled`} trend="up" icon={<Calendar className="h-6 w-6" />} />
        <MetricCard label="Unfilled Shifts" value={unfilled.length.toString()} change="Requires action" trend="down" icon={<AlertTriangle className="h-6 w-6" />} />
        <MetricCard label="Active Staff" value={availableStaff.length.toString()} change="Available now" trend="up" icon={<Users className="h-6 w-6" />} />
        <MetricCard label="Agency Spend" value="$51.2K" change="+8% vs roster" trend="down" icon={<DollarSign className="h-6 w-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-[#1B3569] mb-4">Live Shift Alerts</h3>
          {unfilled.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-[#888]">
              <CheckCircle className="h-4 w-4 text-green-500" />
              All shifts are filled. Great work!
            </div>
          ) : (
            <div className="space-y-3">
              {unfilled.slice(0, 5).map(shift => (
                <div key={shift.id} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-lg border border-black/[0.05]">
                  <div>
                    <p className="text-sm font-semibold text-[#1B3569]">{shift.ward}</p>
                    <p className="text-xs text-[#888]">{shift.facility} · {shift.startTime}–{shift.endTime} · {shift.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${shift.priority === 'High' ? 'bg-[#E3F2FD] text-[#1565C0] border border-[#90CAF9]' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>{shift.priority}</span>
                    <button onClick={() => navigate('/shifts')} className="text-xs font-semibold text-[#1565C0] hover:bg-[#E3F2FD] px-2 py-1 rounded transition-colors">Fill</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold text-[#1B3569] mb-4">AI Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
              <p className="text-sm text-[#555]">4 shifts can be auto-filled with Smart Match</p>
            </div>
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <p className="text-sm text-[#555]">2 staff credentials expiring within 30 days</p>
            </div>
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-[#555]">Agency spend up 8% this month</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
