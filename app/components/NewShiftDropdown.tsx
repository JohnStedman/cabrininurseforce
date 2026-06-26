/**
 * Shared "+New Shift" dropdown used consistently across all pages.
 * Includes the dropdown menu, Add Shift modal, and Bulk Shifts modal.
 * Persists shifts to shiftStore for demo continuity.
 */
import { useState, useRef } from 'react';
import { Plus, ChevronDown, Calendar, Building2, UserCog, Briefcase, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { addShift } from '../data/shiftStore';
import { type Shift } from '../data/mockData';

interface Props {
  /** Visual variant — 'ghost' for use on coloured hero banners, 'solid' for white backgrounds */
  variant?: 'ghost' | 'solid';
}

export function NewShiftDropdown({ variant = 'ghost' }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  // Add Shift form
  const [date, setDate] = useState('');
  const [facility, setFacility] = useState('cabrini-malvern');
  const [ward, setWard] = useState('icu');
  const [shiftType, setShiftType] = useState('AM');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('15:30');
  const [role, setRole] = useState('rn');
  const [priority, setPriority] = useState('medium');
  const [rationale, setRationale] = useState('roster-vacancy');
  const [toHospital, setToHospital] = useState(false);
  const [toCasual, setToCasual] = useState(false);
  const [toAgency, setToAgency] = useState(false);

  const handleShiftType = (val: string) => {
    setShiftType(val);
    if (val === 'AM') { setStartTime('07:00'); setEndTime('15:30'); }
    else if (val === 'PM') { setStartTime('13:30'); setEndTime('21:30'); }
    else { setStartTime('21:00'); setEndTime('07:30'); }
  };

  const handleAdd = () => {
    const wardNames: Record<string, string> = { 'acute-medical': 'Acute Medical', cardiology: 'Cardiology', 'coronary-care': 'Coronary Care', 'day-surgery': 'Day Surgery', emergency: 'Emergency', 'general-surgery': 'General Surgery', gynaecology: 'Gynaecology', icu: 'ICU', neurology: 'Neurology', 'palliative-care': 'Palliative Care', 'pacu': 'PACU', 'surgical-admissions': 'Surgical Admissions', renal: 'Renal' };
    const facilityNames: Record<string, string> = { 'cabrini-malvern': 'Cabrini Malvern', 'cabrini-brighton': 'Cabrini Brighton', 'cabrini-elsternwick': 'Cabrini Elsternwick' };
    const roleNames: Record<string, string> = { rn: 'RN', en: 'EN', midwife: 'Midwife', support: 'Support Worker' };
    const newShift: Shift = {
      id: `SH_${Date.now()}`,
      facility: facilityNames[facility] ?? 'Cabrini Malvern',
      ward: wardNames[ward] ?? ward,
      date: date || new Date().toISOString().split('T')[0],
      startTime, endTime,
      role: roleNames[role] ?? role.toUpperCase(),
      status: 'Unfilled',
      priority: priority === 'high' ? 'High' : priority === 'low' ? 'Low' : 'Medium',
      location: { address: '183 Wattletree Road', suburb: 'Malvern', postcode: '3144', lat: -37.8566, lng: 145.0519 },
    };
    addShift(newShift);
    setAddOpen(false);
    const notif = [toHospital && 'Hospital Staff', toCasual && 'Casual/Bank', toAgency && 'Agency'].filter(Boolean).join(', ');
    toast.success('Shift added', { description: `${newShift.ward} · ${startTime}–${endTime}${notif ? ` · Sent to: ${notif}` : ''}` });
    setToHospital(false); setToCasual(false); setToAgency(false);
  };

  const btnCls = variant === 'ghost'
    ? 'flex items-center gap-1.5 px-3 h-9 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors'
    : 'flex items-center gap-1.5 px-3 h-9 rounded-lg bg-white hover:bg-white/90 text-[#4263EB] text-sm font-semibold transition-colors shadow-sm';

  return (
    <>
      <div className="relative">
        <button ref={btnRef} onClick={() => setMenuOpen(o => !o)} className={btnCls}>
          <Plus className="h-3.5 w-3.5" />
          New Shift
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>
        {menuOpen && (() => {
          const rect = btnRef.current?.getBoundingClientRect();
          return (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="fixed w-52 bg-white border border-black/[0.09] rounded-xl shadow-xl py-1.5 z-50" style={{ top: rect ? rect.bottom + 8 : 0, left: rect ? rect.left : 0 }}>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F3F6FA] text-left transition-colors" onClick={() => { setMenuOpen(false); setDate(new Date().toISOString().split('T')[0]); setAddOpen(true); }}>
                <div className="h-8 w-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center flex-shrink-0"><Plus className="h-4 w-4 text-[#4263EB]" /></div>
                <div><p className="text-sm font-semibold text-[#111827]">Add Shift</p><p className="text-[11px] text-[#6B7280]">Single shift entry</p></div>
              </button>
              <div className="h-px bg-black/[0.06] mx-3" />
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F3F6FA] text-left transition-colors" onClick={() => { setMenuOpen(false); setBulkOpen(true); }}>
                <div className="h-8 w-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center flex-shrink-0"><Calendar className="h-4 w-4 text-[#4263EB]" /></div>
                <div><p className="text-sm font-semibold text-[#111827]">Bulk Shifts</p><p className="text-[11px] text-[#6B7280]">Multiple shifts at once</p></div>
              </button>
            </div>
          </>
          );
        })()}
      </div>

      {/* ── Add Shift Modal ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-[95vw] max-w-[580px] max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-black/[0.07] flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="h-7 w-7 bg-[#4263EB] rounded-lg flex items-center justify-center flex-shrink-0"><Plus className="h-4 w-4 text-white" /></div>
              Add New Shift
            </DialogTitle>
            <DialogDescription className="text-[12px]">Add a single shift to the Cabrini schedule</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            <div>
              <p className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-3">When &amp; Where</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">Date</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">Facility</Label>
                  <Select value={facility} onValueChange={setFacility}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cabrini-malvern">Cabrini Malvern</SelectItem>
                      <SelectItem value="cabrini-brighton">Cabrini Brighton</SelectItem>
                      <SelectItem value="cabrini-elsternwick">Cabrini Elsternwick</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">Ward</Label>
                  <Select value={ward} onValueChange={setWard}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acute-medical">Acute Medical</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="coronary-care">Coronary Care</SelectItem>
                      <SelectItem value="day-surgery">Day Surgery</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="general-surgery">General Surgery</SelectItem>
                      <SelectItem value="gynaecology">Gynaecology</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="palliative-care">Palliative Care</SelectItem>
                      <SelectItem value="pacu">PACU</SelectItem>
                      <SelectItem value="surgical-admissions">Surgical Admissions</SelectItem>
                      <SelectItem value="renal">Renal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-3">Shift Time</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">Shift Type</Label>
                  <Select value={shiftType} onValueChange={handleShiftType}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM (0700–1530)</SelectItem>
                      <SelectItem value="PM">PM (1330–2130)</SelectItem>
                      <SelectItem value="ND">ND (2100–0730)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">Start</Label>
                  <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="h-10 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">End</Label>
                  <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="h-10 text-sm" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-3">Role &amp; Priority</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">Role Required</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rn">Registered Nurse (RN)</SelectItem>
                      <SelectItem value="en">Enrolled Nurse (EN)</SelectItem>
                      <SelectItem value="midwife">Midwife</SelectItem>
                      <SelectItem value="support">Support Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-semibold text-[#555]">Rationale</Label>
                  <Select value={rationale} onValueChange={setRationale}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unplanned-leave">Unplanned Leave</SelectItem>
                      <SelectItem value="roster-vacancy">Roster Vacancy</SelectItem>
                      <SelectItem value="increased-acuity">Increased Patient Acuity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-3">Notify</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { checked: toHospital, set: setToHospital, icon: Building2,  label: 'Hospital Staff', sub: 'Internal',  colour: 'blue'   },
                  { checked: toCasual,   set: setToCasual,   icon: UserCog,    label: 'Casual / Bank', sub: 'Pool staff', colour: 'violet' },
                  { checked: toAgency,   set: setToAgency,   icon: Briefcase,  label: 'Agency',        sub: 'External',  colour: 'orange' },
                ].map(({ checked, set, icon: Icon, label, sub, colour }) => (
                  <button key={label} type="button" onClick={() => set(!checked)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${checked ? colour === 'blue' ? 'border-blue-400 bg-blue-50' : colour === 'violet' ? 'border-violet-400 bg-violet-50' : 'border-orange-400 bg-orange-50' : 'border-black/[0.08] bg-white hover:border-black/[0.15]'}`}>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${checked ? colour === 'blue' ? 'bg-blue-100' : colour === 'violet' ? 'bg-violet-100' : 'bg-orange-100' : 'bg-[#F4F4F4]'}`}>
                      <Icon className={`h-4 w-4 ${checked ? colour === 'blue' ? 'text-blue-600' : colour === 'violet' ? 'text-violet-600' : 'text-orange-600' : 'text-[#888]'}`} />
                    </div>
                    <p className="text-[11px] font-bold leading-tight text-[#555]">{label}</p>
                    <p className="text-[10px] text-[#AAA]">{sub}</p>
                    {checked && <CheckCircle className={`h-3.5 w-3.5 ${colour === 'blue' ? 'text-blue-500' : colour === 'violet' ? 'text-violet-500' : 'text-orange-500'}`} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/[0.07] bg-[#FAFAFA] flex-shrink-0">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2.5 rounded-lg border border-black/[0.09] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors">Cancel</button>
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#4263EB] hover:bg-[#3B5BD9] text-white text-sm font-semibold transition-colors">
              <Plus className="h-4 w-4" />Add Shift
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Shifts Modal ── */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="w-[95vw] max-w-[520px] max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-black/[0.07] flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="h-7 w-7 bg-[#4263EB] rounded-lg flex items-center justify-center flex-shrink-0"><Calendar className="h-4 w-4 text-white" /></div>
              Bulk Shifts
            </DialogTitle>
            <DialogDescription className="text-[12px]">Create recurring or multiple shifts at once</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#555]">Ward</Label>
                <Select defaultValue="icu">
                  <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="icu">ICU — Intensive Care</SelectItem>
                    <SelectItem value="ed">Emergency Department</SelectItem>
                    <SelectItem value="surgical">Surgical Ward 3A</SelectItem>
                    <SelectItem value="medical">Medical Ward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#555]">Role</Label>
                <Select defaultValue="rn">
                  <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rn">Registered Nurse (RN)</SelectItem>
                    <SelectItem value="en">Enrolled Nurse (EN)</SelectItem>
                    <SelectItem value="midwife">Midwife</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-[#555]">Repeat Days</Label>
              <div className="flex gap-1.5">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <button key={d} className="flex-1 py-2 rounded-lg border border-black/[0.09] text-[11px] font-semibold text-[#374151] hover:border-[#4263EB] hover:bg-[#EEF2FF] hover:text-[#4263EB] transition-all">{d}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#555]">From</Label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="h-10 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#555]">To</Label>
                <Input type="date" className="h-10 text-sm" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/[0.07] bg-[#FAFAFA] flex-shrink-0">
            <button onClick={() => setBulkOpen(false)} className="px-4 py-2.5 rounded-lg border border-black/[0.09] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors">Cancel</button>
            <button onClick={() => { setBulkOpen(false); toast.success('Bulk shifts created', { description: 'Shifts added to the schedule' }); }} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#4263EB] hover:bg-[#3B5BD9] text-white text-sm font-semibold transition-colors">
              <Calendar className="h-4 w-4" />Create Bulk Shifts
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
