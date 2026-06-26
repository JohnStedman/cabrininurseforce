export interface Shift {
  id: string;
  date: string;
  facility: string;
  ward: string;
  startTime: string;
  endTime: string;
  role: string;
  status: 'Filled' | 'Unfilled' | 'Pending' | 'Confirmed' | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  assignedStaff?: string;
  location?: { address: string; suburb: string; postcode: string; lat: number; lng: number };
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  status: string;
  yearsExperience: number;
  complianceStatus: string;
  ahpraRegistration: string;
  skills: string[];
  hourlyRate?: number;
  availability?: string;
  distance?: string;
  staffType?: string;
  agencyName?: string;
  matchScore?: number;
  preferredLocations?: string[];
}

export interface Provider {
  id: string;
  name: string;
  priorityTier: number;
  contractorCount: number;
  status: string;
  email: string;
  primaryContact: { name: string; phone: string; email: string };
  address?: string;
  phone?: string;
  abn?: string;
  contractStart?: string;
  contractEnd?: string;
  performanceRating?: number;
  totalShifts?: number;
  rateCard?: Record<string, number>;
  notes?: string;
}

export interface ProviderContractor {
  id: string;
  name: string;
  jobRole: string;
  skills: string[];
  complianceStatus: string;
  status: string;
  ahpraRegistration?: string;
  providerId?: string;
  providerName?: string;
  doNotSend?: boolean;
  hourlyRate?: number;
  preferredLocations?: string[];
  yearsExperience?: number;
  availability?: string;
  distance?: string;
  matchScore?: number;
  agencyName?: string;
  phone?: string;
  email?: string;
  ahpraExpiry?: string;
  policeCheckExpiry?: string;
  wwccExpiry?: string;
  immunisations?: string;
  nextTraining?: string;
  startDate?: string;
  lastShift?: string;
  totalShifts?: number;
  avgShiftDuration?: string;
  monthlyHours?: string;
  hourlyRates?: { en?: number; rn?: number; am?: number; pm?: number; nd?: number; sw?: number; fullDay?: number };
  nihelmsApproved?: boolean;
  cabriniApproved?: boolean;
  nihelmsApprovedDate?: string;
  cabriniApprovedDate?: string;
  nextAvail?: string;
  doNotSendReason?: string;
  clients?: string[];
  notes?: string;
}

export interface ProviderContact {
  id: string;
  providerId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export const mockStaff: Staff[] = [
  { id: 'S1', name: 'Sarah Mitchell', role: 'RN', status: 'Available', yearsExperience: 8, complianceStatus: 'Current', ahpraRegistration: 'AHPRA123456', skills: ['ICU', 'Emergency', 'Triage'] },
  { id: 'S2', name: 'James Chen', role: 'EN', status: 'Available', yearsExperience: 5, complianceStatus: 'Current', ahpraRegistration: 'AHPRA789012', skills: ['Medical', 'Surgical'] },
  { id: 'S3', name: 'Emily Wang', role: 'RN', status: 'On Duty', yearsExperience: 12, complianceStatus: 'Current', ahpraRegistration: 'AHPRA345678', skills: ['ICU', 'PACU'] },
  { id: 'S4', name: 'Michael Brown', role: 'RN', status: 'Available', yearsExperience: 6, complianceStatus: 'Expiring Soon', ahpraRegistration: 'AHPRA901234', skills: ['Emergency', 'Paediatrics'] },
  { id: 'S5', name: 'Sophie Palmer', role: 'RN', status: 'Available', yearsExperience: 10, complianceStatus: 'Current', ahpraRegistration: 'AHPRA567890', skills: ['ICU', 'Emergency', 'Trauma'] },
];

export const mockProviders: Provider[] = [
  { id: 'P1', name: 'Your Nursing Agency', priorityTier: 1, contractorCount: 5, status: 'Active', email: 'yna@example.com', primaryContact: { name: 'Jane Smith', phone: '0400123456', email: 'jane@yna.com' } },
  { id: 'P2', name: 'XYZ Medical Staffing', priorityTier: 2, contractorCount: 3, status: 'Active', email: 'xyz@example.com', primaryContact: { name: 'Bob Jones', phone: '0400987654', email: 'bob@xyz.com' } },
  { id: 'P3', name: 'Green Healthcare', priorityTier: 3, contractorCount: 2, status: 'Active', email: 'green@example.com', primaryContact: { name: 'Alice Green', phone: '0400567890', email: 'alice@green.com' } },
];

export const mockProviderContractors: ProviderContractor[] = [
  { id: 'C1', name: 'Rachel Green', jobRole: 'RN', skills: ['ICU', 'Emergency'], complianceStatus: 'Current', status: 'Active', ahpraRegistration: 'AHPRA111111' },
  { id: 'C2', name: 'Tom Wilson', jobRole: 'EN', skills: ['Medical', 'Surgical'], complianceStatus: 'Current', status: 'Active', ahpraRegistration: 'AHPRA222222' },
  { id: 'C3', name: 'Lisa Anderson', jobRole: 'RN', skills: ['Paediatrics', 'Neonatal'], complianceStatus: 'Expiring Soon', status: 'Active', ahpraRegistration: 'AHPRA333333' },
];

export const mockShifts: Shift[] = [
  { id: 'SH001', date: '2024-03-20', facility: 'Cabrini Malvern', ward: 'ICU', startTime: '07:00', endTime: '15:30', role: 'RN', status: 'Unfilled', priority: 'High' },
  { id: 'SH002', date: '2024-03-20', facility: 'Cabrini Malvern', ward: 'Emergency', startTime: '13:30', endTime: '21:30', role: 'EN', status: 'Unfilled', priority: 'High' },
  { id: 'SH003', date: '2024-03-20', facility: 'Cabrini Brighton', ward: 'Medical', startTime: '21:00', endTime: '07:30', role: 'RN', status: 'Unfilled', priority: 'Medium' },
  { id: 'SH004', date: '2024-03-21', facility: 'Cabrini Malvern', ward: 'Surgical', startTime: '07:00', endTime: '15:30', role: 'RN', status: 'Filled', priority: 'Medium', assignedStaff: 'Sarah Mitchell' },
  { id: 'SH005', date: '2024-03-21', facility: 'Cabrini Elsternwick', ward: 'Palliative Care', startTime: '13:30', endTime: '21:30', role: 'EN', status: 'Unfilled', priority: 'Low' },
];
