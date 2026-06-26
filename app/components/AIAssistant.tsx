import { useState, useEffect } from "react";
import { Sparkles, Send, Loader2, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { mockStaff } from "../data/mockData";
import { getShifts } from "../data/shiftStore";
const mockShifts = getShifts();
import { useLocation, useNavigate } from "react-router";

const PAGE_SPECIFIC_FILTERS: Record<string, string[]> = {
  '/': [
    "Show critical alerts",
    "Unfilled shifts today",
    "Staff compliance overview",
    "Revenue summary this month"
  ],
  '/shifts': [
    "Show unfilled shifts",
    "Critical urgency shifts only",
    "Night shifts this week",
    "Weekend shifts needing coverage",
    "Find RNs available tonight",
    "Show overtime opportunities"
  ],
  '/staff': [
    "Show available staff today",
    "Staff with expiring credentials",
    "Highest rated nurses",
    "New hires this month",
    "Staff needing training",
    "Show casual staff availability"
  ],
  '/deployment': [
    "Show all deployed staff",
    "Staff at Cabrini Malvern",
    "Agency staff on shift today",
    "Critical coverage locations",
    "Staff finishing shifts soon",
    "Workforce composition breakdown"
  ],
  '/contractors': [
    "Available casual staff",
    "Casual bank staff on shift today",
    "Compliance at risk",
    "Top rated contractors",
    "Show ICU specialists",
    "Emergency RN availability"
  ],
  '/agency-dashboard': [
    "My available staff",
    "Urgent shifts to fill",
    "High paying shifts",
    "My staff on shift today",
    "Weekend opportunities",
    "Night shift premiums"
  ],
  '/providers': [
    "Top performing agencies",
    "Agencies with availability",
    "Compliance risk agencies",
    "New agency partners",
    "Emergency contacts",
    "Contract renewal due"
  ],
  '/compliance': [
    "Expiring AHPRA registrations",
    "High risk compliance issues",
    "Documents due this week",
    "Police checks expiring",
    "Immunisation updates needed",
    "Staff missing credentials"
  ],
  '/timesheets': [
    "Pending approvals",
    "Overtime this week",
    "Disputed timesheets",
    "Late submissions",
    "High cost shifts",
    "Unapproved weekend shifts"
  ],
  '/reports': [
    "Generate weekly report",
    "Compliance summary",
    "Cost analysis",
    "Staff utilisation",
    "Agency performance",
    "Shift fill rates"
  ],
  '/costing': [
    "Highest cost shifts",
    "Savings opportunities",
    "Agency vs internal comparison",
    "Overtime analysis",
    "Budget variance",
    "Cost per shift trends"
  ],
  '/audit-log': [
    "Recent changes",
    "User activity today",
    "Failed login attempts",
    "Data exports",
    "Permission changes",
    "Critical actions"
  ],
  '/smart-match': [
    "Best match for shift",
    "Available specialists",
    "Nearest staff members",
    "Highest compatibility",
    "Emergency backfill",
    "Skills match analysis"
  ]
};

export function AIAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<any>(null);

  // Get page-specific filters
  const currentFilters = PAGE_SPECIFIC_FILTERS[location.pathname] || PAGE_SPECIFIC_FILTERS['/'];

  // Keyboard shortcut support (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (questionText?: string) => {
    const question = questionText || query;
    if (!question.trim()) return;

    setIsProcessing(true);
    setIsExpanded(true);
    setResponse(null);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate response based on question
    const aiResponse = generateResponse(question.toLowerCase());
    setResponse(aiResponse);
    setIsProcessing(false);
    setQuery("");
  };

  const handleActionClick = (actionLabel: string) => {
    // Navigate based on action label
    const label = actionLabel.toLowerCase();
    
    if (label.includes('view all ens') || label.includes('enrolled nurses')) {
      navigate('/staff');
      setIsOpen(false);
    } else if (label.includes('view all midwives')) {
      navigate('/staff');
      setIsOpen(false);
    } else if (label.includes('assign to shift') || label.includes('allocate to shift') || label.includes('assign to maternity')) {
      navigate('/shifts');
      setIsOpen(false);
    } else if (label.includes('view all shifts') || label.includes('view all open shifts') || label.includes('view all night shifts')) {
      navigate('/shifts');
      setIsOpen(false);
    } else if (label.includes('view all available staff') || label.includes('view all skilled staff') || label.includes('view all experienced staff')) {
      navigate('/staff');
      setIsOpen(false);
    } else if (label.includes('compliance') || label.includes('view full compliance')) {
      navigate('/compliance');
      setIsOpen(false);
    } else if (label.includes('cost') || label.includes('view full cost report')) {
      navigate('/costing');
      setIsOpen(false);
    } else if (label.includes('smart') || label.includes('auto-fill')) {
      navigate('/smart-match');
      setIsOpen(false);
    } else if (label.includes('deployment') || label.includes('see staff deployment') || label.includes('view map')) {
      navigate('/deployment');
      setIsOpen(false);
    } else if (label.includes('report') || label.includes('performance reports') || label.includes('utilisation report')) {
      navigate('/reports');
      setIsOpen(false);
    } else if (label.includes('dashboard')) {
      navigate('/');
      setIsOpen(false);
    }
  };

  const generateResponse = (question: string) => {
    const questionLower = question.toLowerCase();

    // Critical Alerts
    if (questionLower.includes('critical alert') || questionLower.includes('show critical')) {
      const unfilledShifts = mockShifts.filter(s => s.status === 'Unfilled');
      const highPriorityShifts = unfilledShifts.filter(s => s.priority === 'High');
      const expiringCompliance = mockStaff.filter(s => {
        const daysUntilExpiry = Math.floor(
          (new Date(s.ahpraExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry < 30;
      });

      return {
        type: "data",
        title: "Critical Alerts",
        message: `Found ${highPriorityShifts.length} high-priority unfilled shifts and ${expiringCompliance.length} critical compliance issues:`,
        stats: {
          urgentShifts: highPriorityShifts.length,
          compliance: expiringCompliance.length,
          totalAlerts: highPriorityShifts.length + expiringCompliance.length,
        },
        data: [
          { 
            label: "High Priority Unfilled Shifts", 
            value: `${highPriorityShifts.length} shifts need immediate attention`, 
            status: highPriorityShifts.length > 0 ? "critical" : "good" 
          },
          { 
            label: "Critical Compliance Issues", 
            value: `${expiringCompliance.length} staff with expiring AHPRA`, 
            status: expiringCompliance.length > 0 ? "warning" : "good" 
          },
          { 
            label: "Total Unfilled Shifts", 
            value: `${unfilledShifts.length} across all facilities`, 
            status: "warning" 
          },
        ],
        actions: [
          { label: "View All Open Shifts", primary: true },
          { label: "View Full Compliance", primary: false },
        ],
      };
    }

    // Deployed Staff
    if (questionLower.includes('deployed') || questionLower.includes('on shift') || questionLower.includes('currently working')) {
      const today = '2026-03-04';
      const todayShifts = mockShifts.filter(s => s.date === today || s.date === '2026-03-17');
      const deployedStaff = todayShifts.filter(shift => shift.status === 'Filled' && shift.assignedStaff);
      
      const byType = {
        internal: deployedStaff.filter(s => s.assignedStaffType === 'Internal').length,
        pool: deployedStaff.filter(s => s.assignedStaffType === 'Pool').length,
        bank: deployedStaff.filter(s => s.assignedStaffType === 'Bank').length,
        agency: deployedStaff.filter(s => s.assignedStaffType === 'Agency').length,
      };

      // Check for specific location filter
      let filteredDeployed = deployedStaff;
      let locationName = 'all locations';
      if (questionLower.includes('malvern')) {
        filteredDeployed = deployedStaff.filter(s => s.facility.toLowerCase().includes('malvern'));
        locationName = 'Cabrini Malvern';
      }

      return {
        type: "data",
        title: "Currently Deployed Staff",
        message: `${filteredDeployed.length} staff members currently deployed${locationName !== 'all locations' ? ` at ${locationName}` : ''}:`,
        stats: {
          total: filteredDeployed.length,
          internal: byType.internal,
          pool: byType.pool,
          bank: byType.bank,
          agency: byType.agency,
        },
        data: filteredDeployed.slice(0, 5).map(shift => ({
          staff: shift.assignedStaff,
          facility: shift.facility,
          ward: shift.ward,
          shift: `${shift.startTime} - ${shift.endTime}`,
          type: shift.assignedStaffType || 'Bank',
          role: shift.role,
        })),
        actions: [
          { label: "See Staff Deployment", primary: true },
          { label: "View All Shifts", primary: false },
        ],
      };
    }

    // Workforce Composition
    if (questionLower.includes('workforce composition') || questionLower.includes('staff breakdown')) {
      const internal = mockStaff.filter(s => s.staffType === 'Internal');
      const pool = mockStaff.filter(s => s.staffType === 'Pool');
      const bank = mockStaff.filter(s => s.staffType === 'Bank');
      const agency = mockStaff.filter(s => s.staffType === 'Agency');
      const total = mockStaff.length;

      return {
        type: "data",
        title: "Workforce Composition",
        message: `Complete breakdown of ${total} staff members by type:`,
        stats: {
          internal: internal.length,
          pool: pool.length,
          bank: bank.length,
          agency: agency.length,
        },
        data: [
          { 
            label: "Internal Staff (Ward)", 
            value: `${internal.length} (${Math.round((internal.length/total)*100)}%)`, 
            status: "good",
            available: internal.filter(s => s.status === 'Available').length
          },
          { 
            label: "Nurse Pool (Permanent)", 
            value: `${pool.length} (${Math.round((pool.length/total)*100)}%)`, 
            status: "good",
            available: pool.filter(s => s.status === 'Available').length
          },
          { 
            label: "Casual Bank (125%)", 
            value: `${bank.length} (${Math.round((bank.length/total)*100)}%)`, 
            status: "good",
            available: bank.filter(s => s.status === 'Available').length
          },
          { 
            label: "Agency Staff", 
            value: `${agency.length} (${Math.round((agency.length/total)*100)}%)`, 
            status: "good",
            available: agency.filter(s => s.status === 'Available').length
          },
        ],
        actions: [
          { label: "View All Available Staff", primary: true },
          { label: "See Staff Deployment", primary: false },
        ],
      };
    }

    // Critical Coverage Locations
    if (questionLower.includes('critical coverage') || questionLower.includes('critical location')) {
      const today = '2026-03-04';
      const todayShifts = mockShifts.filter(s => s.date === today || s.date === '2026-03-17');
      const facilities = [...new Set(todayShifts.map(s => s.facility))];
      
      const locationStats = facilities.map(facility => {
        const facilityShifts = todayShifts.filter(s => s.facility === facility);
        const filled = facilityShifts.filter(s => s.status === 'Filled').length;
        const total = facilityShifts.length;
        const coverage = total > 0 ? Math.round((filled / total) * 100) : 100;
        
        return {
          facility,
          coverage,
          filled,
          total,
          status: coverage < 70 ? 'Critical' : coverage < 90 ? 'Adequate' : 'Optimal'
        };
      }).filter(loc => loc.status === 'Critical' || loc.status === 'Adequate');

      return {
        type: "data",
        title: "Critical Coverage Locations",
        message: `${locationStats.filter(l => l.status === 'Critical').length} locations need immediate attention:`,
        data: locationStats.map(loc => ({
          facility: loc.facility,
          coverage: `${loc.coverage}%`,
          shifts: `${loc.filled}/${loc.total} filled`,
          status: loc.status,
        })),
        actions: [
          { label: "See Staff Deployment", primary: true },
          { label: "View All Open Shifts", primary: false },
        ],
      };
    }

    // Staff Finishing Soon
    if (questionLower.includes('finishing soon') || questionLower.includes('finishing shifts soon') || questionLower.includes('shift end') || (questionLower.includes('staff finishing') && questionLower.includes('soon'))) {
      const today = '2026-03-04';
      const now = new Date('2026-03-04T14:30');
      const todayShifts = mockShifts.filter(s => (s.date === today || s.date === '2026-03-17') && s.status === 'Filled');
      
      const finishingSoon = todayShifts.filter(shift => {
        const shiftEnd = new Date(`2026-03-04T${shift.endTime}`);
        const hoursRemaining = (shiftEnd.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursRemaining > 0 && hoursRemaining < 2;
      });

      return {
        type: "data",
        title: "Staff Finishing Shifts Soon",
        message: `${finishingSoon.length} staff members finishing within 2 hours:`,
        data: finishingSoon.slice(0, 5).map(shift => ({
          staff: shift.assignedStaff,
          facility: shift.facility,
          ward: shift.ward,
          endTime: shift.endTime,
          role: shift.role,
        })),
        actions: [
          { label: "See Staff Deployment", primary: true },
          { label: "Plan Handovers", primary: false },
        ],
      };
    }

    // Facility/Site Information
    if (questionLower.includes('cabrini') || questionLower.includes('facility') || questionLower.includes('site')) {
      const facilities = [...new Set(mockShifts.map(s => s.facility))];
      const wards = [...new Set(mockShifts.map(s => s.ward))];
      const cabriniShifts = mockShifts.filter(s => s.facility.toLowerCase().includes('cabrini'));
      
      return {
        type: "data",
        title: "Cabrini Facilities & Site Information",
        message: `Managing ${cabriniShifts.length} shifts across ${facilities.length} facilities and ${wards.length} departments:`,
        data: [
          { label: "Primary Facility", value: "Cabrini Malvern", status: "Active" },
          { label: "Total Departments", value: wards.length.toString(), status: "good" },
          { label: "Active Shifts", value: cabriniShifts.length.toString(), status: "good" },
          { label: "Total Staff Pool", value: mockStaff.length.toString(), status: "good" },
        ],
        actions: [
          { label: "View All Shifts", primary: true },
          { label: "See Staff Deployment", primary: false },
        ],
      };
    }

    // Ward/Department specific searches
    if (questionLower.includes('ward') || questionLower.includes('department') || questionLower.includes('icu') || questionLower.includes('emergency')) {
      let targetWard = '';
      if (questionLower.includes('icu')) targetWard = 'ICU';
      else if (questionLower.includes('emergency') || questionLower.includes('ed')) targetWard = 'Emergency';
      else if (questionLower.includes('surgical')) targetWard = 'Surgical';
      else if (questionLower.includes('maternity')) targetWard = 'Maternity';

      const wardShifts = targetWard 
        ? mockShifts.filter(s => s.ward.toLowerCase().includes(targetWard.toLowerCase()))
        : mockShifts;

      const unfilledInWard = wardShifts.filter(s => s.status === 'Unfilled');
      
      return {
        type: "data",
        title: targetWard ? `${targetWard} Department` : "All Departments",
        message: `Found ${wardShifts.length} shifts${targetWard ? ` in ${targetWard}` : ''}, ${unfilledInWard.length} unfilled:`,
        data: wardShifts.slice(0, 5).map(shift => ({
          facility: shift.facility,
          ward: shift.ward,
          date: new Date(shift.date).toLocaleDateString("en-AU"),
          time: `${shift.startTime} - ${shift.endTime}`,
          status: shift.status,
          priority: shift.priority
        })),
        actions: [
          { label: "View Department Details", primary: true },
          { label: "Fill Urgent Shifts", primary: false },
        ],
      };
    }

    // Staff by skills
    if (questionLower.includes('skill') || questionLower.includes('specialist') || questionLower.includes('trauma') || questionLower.includes('triage')) {
      let targetSkill = '';
      if (questionLower.includes('trauma')) targetSkill = 'Trauma';
      else if (questionLower.includes('triage')) targetSkill = 'Triage';
      else if (questionLower.includes('icu')) targetSkill = 'ICU';
      else if (questionLower.includes('emergency')) targetSkill = 'Emergency';
      else if (questionLower.includes('cardiac')) targetSkill = 'Cardiac';
      else if (questionLower.includes('surgical')) targetSkill = 'Surgical';
      else if (questionLower.includes('paediatric')) targetSkill = 'Paediatric';

      const skilledStaff = targetSkill
        ? mockStaff.filter(s => s.skills.some(skill => skill.toLowerCase().includes(targetSkill.toLowerCase())))
        : mockStaff;

      return {
        type: "data",
        title: targetSkill ? `Staff with ${targetSkill} Skills` : "All Staff Skills",
        message: `Found ${skilledStaff.length} staff members${targetSkill ? ` with ${targetSkill} experience` : ''}:`,
        data: skilledStaff.slice(0, 5).map(staff => ({
          name: staff.name,
          role: staff.role,
          skills: staff.skills.join(', '),
          status: staff.status,
          experience: `${staff.yearsExperience} years`,
          rating: staff.clientRating
        })),
        actions: [
          { label: "View All Skilled Staff", primary: true },
          { label: "Assign to Shift", primary: false },
        ],
      };
    }

    // Location/Distance searches
    if (questionLower.includes('location') || questionLower.includes('near') || questionLower.includes('distance') || questionLower.includes('suburb')) {
      const locations = [...new Set(mockStaff.map(s => s.location.suburb))];
      const locationCounts = locations.map(loc => ({
        suburb: loc,
        count: mockStaff.filter(s => s.location.suburb === loc).length,
        postcode: mockStaff.find(s => s.location.suburb === loc)?.location.postcode
      }));

      return {
        type: "data",
        title: "Staff Locations",
        message: `Staff distributed across ${locations.length} locations:`,
        data: locationCounts.map(loc => ({
          location: `${loc.suburb} ${loc.postcode}`,
          staffCount: `${loc.count} staff members`,
          availability: mockStaff.filter(s => s.location.suburb === loc.suburb && s.status === 'Available').length
        })),
        actions: [
          { label: "View Map View", primary: true },
          { label: "Find Nearest Staff", primary: false },
        ],
      };
    }

    // Staff type searches (Internal/Pool/Bank/Agency)
    if (questionLower.includes('internal') || questionLower.includes('pool') || questionLower.includes('bank') || questionLower.includes('casual') || questionLower.includes('agency') || questionLower.includes('staff type')) {
      const internal = mockStaff.filter(s => s.staffType === 'Internal');
      const pool = mockStaff.filter(s => s.staffType === 'Pool');
      const bank = mockStaff.filter(s => s.staffType === 'Bank');
      const agency = mockStaff.filter(s => s.staffType === 'Agency');

      return {
        type: "data",
        title: "Staff by Type",
        message: "Workforce breakdown by employment type:",
        stats: {
          internal: internal.length,
          pool: pool.length,
          bank: bank.length,
          agency: agency.length,
        },
        data: [
          { label: "Internal Staff (Ward)", value: `${internal.length} staff (${internal.filter(s => s.status === 'Available').length} available)`, status: "good" },
          { label: "Nurse Pool (Permanent)", value: `${pool.length} staff (${pool.filter(s => s.status === 'Available').length} available)`, status: "good" },
          { label: "Casual Bank (125% rate)", value: `${bank.length} staff (${bank.filter(s => s.status === 'Available').length} available)`, status: "good" },
          { label: "Agency Staff", value: `${agency.length} staff (${agency.filter(s => s.status === 'Available').length} available)`, status: "good" },
          { label: "Average Casual Bank Rate", value: "125% of base", status: "good" },
          { label: "Average Agency Rate", value: "$78/hr", status: "warning" },
        ],
        actions: [
          { label: "View Cost Analysis", primary: true },
          { label: "Optimise Workforce Mix", primary: false },
        ],
      };
    }

    // Experience/Years searches
    if (questionLower.includes('experience') || questionLower.includes('senior') || questionLower.includes('years')) {
      const experienced = mockStaff.filter(s => s.yearsExperience >= 10);
      const midLevel = mockStaff.filter(s => s.yearsExperience >= 5 && s.yearsExperience < 10);
      const junior = mockStaff.filter(s => s.yearsExperience < 5);

      return {
        type: "data",
        title: "Staff by Experience Level",
        message: `Workforce experience breakdown:`,
        stats: {
          senior: experienced.length,
          midLevel: midLevel.length,
          junior: junior.length,
        },
        data: experienced.slice(0, 5).map(staff => ({
          name: staff.name,
          role: staff.role,
          experience: `${staff.yearsExperience} years`,
          rating: staff.clientRating,
          status: staff.status,
          shifts: staff.shiftsCompleted
        })),
        actions: [
          { label: "View All Experienced Staff", primary: true },
          { label: "Assign to Complex Shifts", primary: false },
        ],
      };
    }

    // Hours/Availability searches
    if (questionLower.includes('hours') || questionLower.includes('workload') || questionLower.includes('utilization')) {
      const highUtilization = mockStaff.filter(s => s.hoursThisMonth >= 150);
      const mediumUtilization = mockStaff.filter(s => s.hoursThisMonth >= 100 && s.hoursThisMonth < 150);
      const lowUtilization = mockStaff.filter(s => s.hoursThisMonth < 100);

      return {
        type: "data",
        title: "Staff Utilization & Hours",
        message: `Current month workforce utilization:`,
        stats: {
          high: highUtilization.length,
          medium: mediumUtilization.length,
          low: lowUtilization.length,
        },
        data: [...mockStaff].sort((a, b) => b.hoursThisMonth - a.hoursThisMonth).slice(0, 5).map(staff => ({
          name: staff.name,
          role: staff.role,
          hours: `${staff.hoursThisMonth} hrs this month`,
          shifts: staff.shiftsCompleted,
          status: staff.status
        })),
        actions: [
          { label: "View Utilization Report", primary: true },
          { label: "Balance Workload", primary: false },
        ],
      };
    }

    // Shift time searches (night/day/weekend)
    if (questionLower.includes('night') || questionLower.includes('evening') || questionLower.includes('overnight')) {
      const nightShifts = mockShifts.filter(s => {
        const startHour = parseInt(s.startTime.split(':')[0]);
        return startHour >= 19 || startHour < 7;
      });
      const unfilledNight = nightShifts.filter(s => s.status === 'Unfilled');

      return {
        type: "data",
        title: "Night Shifts",
        message: `Found ${nightShifts.length} night shifts, ${unfilledNight.length} unfilled:`,
        data: nightShifts.slice(0, 5).map(shift => ({
          facility: shift.facility,
          ward: shift.ward,
          date: new Date(shift.date).toLocaleDateString("en-AU"),
          time: `${shift.startTime} - ${shift.endTime}`,
          role: shift.role,
          status: shift.status
        })),
        actions: [
          { label: "View All Night Shifts", primary: true },
          { label: "Find Night Shift Staff", primary: false },
        ],
      };
    }

    // Cost/Budget searches
    if (questionLower.includes('cost') || questionLower.includes('budget') || questionLower.includes('spend') || questionLower.includes('rate')) {
      const filledShifts = mockShifts.filter(s => s.status === 'Filled' && s.estimatedCost);
      const totalCost = filledShifts.reduce((sum, s) => sum + (s.estimatedCost || 0), 0);
      const agencyShifts = filledShifts.filter(s => s.assignedStaffType === 'Agency');
      const poolShifts = filledShifts.filter(s => s.assignedStaffType === 'Pool');
      const bankShifts = filledShifts.filter(s => s.assignedStaffType === 'Bank');
      const agencyCost = agencyShifts.reduce((sum, s) => sum + (s.estimatedCost || 0), 0);

      return {
        type: "data",
        title: "Supplemental Workforce Spend",
        message: `Current period cost analysis:`,
        stats: {
          total: `$${totalCost.toLocaleString()}`,
          agency: `$${agencyCost.toLocaleString()}`,
          shifts: filledShifts.length,
        },
        data: [
          { label: "Total Supplemental Spend", value: `$${totalCost.toLocaleString()}`, status: "good" },
          { label: "Agency Costs", value: `$${agencyCost.toLocaleString()} (${agencyShifts.length} shifts)`, status: "warning" },
          { label: "Pool Costs", value: `${poolShifts.length} shifts (standard rate)`, status: "good" },
          { label: "Casual Bank Costs", value: `${bankShifts.length} shifts (125% rate)`, status: "good" },
          { label: "Average Cost/Shift", value: `$${Math.round(totalCost / filledShifts.length)}`, status: "good" },
        ],
        actions: [
          { label: "View Full Cost Report", primary: true },
          { label: "Identify Savings", primary: false },
        ],
      };
    }

    // Role-specific searches (RN, EN, Midwife, etc.)
    if (questionLower.includes('midwife')) {
      const midwives = mockStaff.filter(s => s.role === 'Midwife');
      return {
        type: "data",
        title: "Midwife Staff",
        message: `Found ${midwives.length} registered midwives:`,
        data: midwives.map(staff => ({
          name: staff.name,
          status: staff.status,
          staffType: staff.staffType,
          organization: staff.organization || 'N/A',
          skills: staff.skills.slice(0, 3).join(', '),
          experience: `${staff.yearsExperience} years`,
          rating: staff.clientRating
        })),
        actions: [
          { label: "View All Midwives", primary: true },
          { label: "Assign to Maternity", primary: false },
        ],
      };
    }

    if (questionLower.includes('en') || questionLower.includes('enrolled nurse')) {
      const enrolledNurses = mockStaff.filter(s => s.role === 'EN');
      return {
        type: "data",
        title: "Enrolled Nurses",
        message: `Found ${enrolledNurses.length} enrolled nurses:`,
        data: enrolledNurses.map(staff => ({
          name: staff.name,
          status: staff.status,
          staffType: staff.staffType,
          skills: staff.skills.slice(0, 3).join(', '),
          experience: `${staff.yearsExperience} years`,
          rating: staff.clientRating
        })),
        actions: [
          { label: "View All ENs", primary: true },
          { label: "Assign to Shift", primary: false },
        ],
      };
    }

    // Booking/Shift Creation
    if (questionLower.includes("booking") || questionLower.includes("create") || questionLower.includes("new shift")) {
      return {
        type: "action",
        title: "Create New Shift Booking",
        message: "I can help you create a new shift booking. Here's what I need:",
        data: [
          { label: "Facility", value: "Select facility" },
          { label: "Ward/Department", value: "Select ward" },
          { label: "Role Required", value: "RN, EN, Midwife, or Specialist" },
          { label: "Date & Time", value: "Select date and time" },
          { label: "Duration", value: "Shift length" },
        ],
        actions: [
          { label: "Create Booking", primary: true },
          { label: "Quick Fill from Template", primary: false },
        ],
      };
    }

    // AHPRA Certification
    if (questionLower.includes("ahpra") || questionLower.includes("certification") || questionLower.includes("registration")) {
      const expiringStaff = mockStaff.filter((s) => {
        const daysUntilExpiry = Math.floor(
          (new Date(s.ahpraExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry < 60;
      });

      return {
        type: "data",
        title: "AHPRA Certification Status",
        message: `Found ${expiringStaff.length} staff members who need to update their AHPRA certification within 60 days:`,
        data: expiringStaff.slice(0, 5).map((staff) => {
          const daysUntilExpiry = Math.floor(
            (new Date(staff.ahpraExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          return {
            name: staff.name,
            role: staff.role,
            registration: staff.ahpraRegistration,
            expiry: staff.ahpraExpiry,
            status: daysUntilExpiry < 30 ? "Urgent" : "Attention Needed",
            daysRemaining: daysUntilExpiry,
          };
        }),
        actions: [
          { label: "View Full Compliance Report", primary: true },
          { label: "Send Renewal Reminders", primary: false },
        ],
      };
    }

    // Police Checks Expiring
    if (questionLower.includes("police") && (questionLower.includes("check") || questionLower.includes("expir"))) {
      const expiringPoliceChecks = mockStaff.filter((s) => {
        const daysUntilExpiry = Math.floor(
          (new Date(s.policeCheckExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry < 90; // Police checks typically need 90 days notice
      });

      return {
        type: "data",
        title: "Police Checks Expiring",
        message: `Found ${expiringPoliceChecks.length} staff members with police checks expiring within 90 days:`,
        data: expiringPoliceChecks.slice(0, 8).map((staff) => {
          const daysUntilExpiry = Math.floor(
            (new Date(staff.policeCheckExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          return {
            name: staff.name,
            role: staff.role,
            staffType: staff.staffType,
            organization: staff.organization || 'N/A',
            expiry: new Date(staff.policeCheckExpiry).toLocaleDateString('en-AU'),
            status: daysUntilExpiry < 30 ? "Critical" : daysUntilExpiry < 60 ? "Urgent" : "Action Required",
            daysRemaining: `${daysUntilExpiry} days`,
          };
        }),
        actions: [
          { label: "View Full Compliance Report", primary: true },
          { label: "Send Renewal Reminders", primary: false },
        ],
      };
    }

    // Immunization/Vaccination Updates Needed
    if (questionLower.includes("immuni") || questionLower.includes("vaccin")) {
      const expiringImmunizations = mockStaff.filter((s) => {
        const daysUntilExpiry = Math.floor(
          (new Date(s.immunizationExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry < 90; // Immunizations typically need 90 days notice
      });

      return {
        type: "data",
        title: "Immunization Updates Needed",
        message: `Found ${expiringImmunizations.length} staff members requiring immunization updates within 90 days:`,
        data: expiringImmunizations.slice(0, 8).map((staff) => {
          const daysUntilExpiry = Math.floor(
            (new Date(staff.immunizationExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          return {
            name: staff.name,
            role: staff.role,
            staffType: staff.staffType,
            organization: staff.organization || 'N/A',
            expiry: new Date(staff.immunizationExpiry).toLocaleDateString('en-AU'),
            status: daysUntilExpiry < 30 ? "Critical" : daysUntilExpiry < 60 ? "Urgent" : "Action Required",
            daysRemaining: `${daysUntilExpiry} days`,
          };
        }),
        actions: [
          { label: "View Full Compliance Report", primary: true },
          { label: "Schedule Immunizations", primary: false },
        ],
      };
    }

    // Open Jobs/Shifts
    if (questionLower.includes("open") || questionLower.includes("unfilled") || questionLower.includes("vacant")) {
      const unfilledShifts = mockShifts.filter((s) => s.status === "Unfilled");
      const highPriority = unfilledShifts.filter((s) => s.priority === "High");

      return {
        type: "data",
        title: "Open Shifts",
        message: `Found ${unfilledShifts.length} open shifts requiring attention. ${highPriority.length} are high priority:`,
        data: unfilledShifts.slice(0, 5).map(shift => ({
          facility: shift.facility,
          ward: shift.ward,
          date: new Date(shift.date).toLocaleDateString("en-AU"),
          time: `${shift.startTime} - ${shift.endTime}`,
          role: shift.role,
          priority: shift.priority
        })),
        actions: [
          { label: "View All Open Shifts", primary: true },
          { label: "Use Smart Match", primary: false },
        ],
      };
    }

    // Available Staff
    if (questionLower.includes("available") || questionLower.includes("find staff") || questionLower.includes("rn") || questionLower.includes("registered nurse")) {
      const availableStaff = mockStaff.filter((s) => s.status === "Available");
      let filtered = availableStaff;

      if (questionLower.includes("rn") || questionLower.includes("registered nurse")) {
        filtered = availableStaff.filter((s) => s.role === "RN");
      }

      return {
        type: "data",
        title: "Available Staff",
        message: `Found ${filtered.length} available ${questionLower.includes("rn") ? "Registered Nurses" : "staff members"}:`,
        data: filtered.slice(0, 5).map((staff) => ({
          name: staff.name,
          role: staff.role,
          staffType: staff.staffType,
          organization: staff.organization || 'N/A',
          experience: `${staff.yearsExperience} years`,
          rating: staff.clientRating,
          location: `${staff.location.suburb} ${staff.location.postcode}`,
          skills: staff.skills.slice(0, 3).join(", "),
        })),
        actions: [
          { label: "View All Available Staff", primary: true },
          { label: "Allocate to Shift", primary: false },
        ],
      };
    }

    // Top Rated Staff
    if (questionLower.includes("highest rating") || questionLower.includes("best staff") || questionLower.includes("top rated")) {
      const topStaff = [...mockStaff].sort((a, b) => b.clientRating - a.clientRating).slice(0, 5);

      return {
        type: "data",
        title: "Top Rated Staff",
        message: "Here are your highest-rated staff members:",
        data: topStaff.map((staff) => ({
          name: staff.name,
          role: staff.role,
          staffType: staff.staffType,
          rating: staff.clientRating,
          shifts: staff.shiftsCompleted,
          experience: `${staff.yearsExperience} years`,
          status: staff.status,
        })),
        actions: [
          { label: "View Performance Reports", primary: true },
          { label: "Book Top Staff", primary: false },
        ],
      };
    }

    // Urgent Shifts
    if (questionLower.includes("urgent") || questionLower.includes("attention") || questionLower.includes("priority")) {
      const urgentShifts = mockShifts.filter((s) => s.status === "Unfilled" && s.priority === "High");

      return {
        type: "data",
        title: "Urgent Shifts",
        message: `Found ${urgentShifts.length} high-priority unfilled shifts requiring immediate attention:`,
        data: urgentShifts.slice(0, 5).map((shift) => ({
          facility: shift.facility,
          ward: shift.ward,
          role: shift.role,
          date: new Date(shift.date).toLocaleDateString("en-AU"),
          time: `${shift.startTime} - ${shift.endTime}`,
          requirements: shift.specialRequirements?.join(", ") || "None",
        })),
        actions: [
          { label: "Smart Auto-Fill", primary: true },
          { label: "Send Urgent Alerts", primary: false },
        ],
      };
    }

    // Compliance Overview
    if (questionLower.includes("compliance") || questionLower.includes("status")) {
      const totalStaff = mockStaff.length;
      const compliantStaff = mockStaff.filter((s) => s.complianceStatus === "Compliant").length;
      const actionRequired = mockStaff.filter((s) => s.complianceStatus === "Non-Compliant" || s.complianceStatus === "Expiring Soon").length;

      return {
        type: "data",
        title: "Compliance Status Overview",
        message: `System-wide compliance status for ${totalStaff} staff members:`,
        stats: {
          compliant: compliantStaff,
          actionRequired: actionRequired,
          percentage: Math.round((compliantStaff / totalStaff) * 100),
        },
        data: [
          { label: "AHPRA Registration", value: `${compliantStaff} current`, status: "good" },
          { label: "Police Check", value: `${actionRequired} expiring soon`, status: "warning" },
          { label: "Immunization Records", value: "All up to date", status: "good" },
          { label: "Working with Children", value: `${actionRequired} pending renewal`, status: "warning" },
        ],
        actions: [
          { label: "View Full Compliance Dashboard", primary: true },
          { label: "Generate Report", primary: false },
        ],
      };
    }

    // Savings Opportunities
    if (questionLower.includes("savings") || questionLower.includes("saving opportunities") || questionLower.includes("save money")) {
      const filledShifts = mockShifts.filter(s => s.status === 'Filled' && s.estimatedCost);
      const agencyShifts = filledShifts.filter(s => s.assignedStaffType === 'Agency');
      const bankShifts = filledShifts.filter(s => s.assignedStaffType === 'Bank');
      const poolShifts = filledShifts.filter(s => s.assignedStaffType === 'Pool');
      
      // Calculate potential savings by using escalation hierarchy properly
      const agencyCost = agencyShifts.reduce((sum, s) => sum + (s.estimatedCost || 0), 0);
      const avgAgencyCost = agencyShifts.length > 0 ? agencyCost / agencyShifts.length : 0;
      const avgBankCost = avgAgencyCost * 0.70; // Bank typically 30% cheaper than agency
      const avgPoolCost = avgAgencyCost * 0.60; // Pool typically 40% cheaper than agency
      const potentialSavingsBank = (avgAgencyCost - avgBankCost) * agencyShifts.length;
      const potentialSavingsPool = (avgAgencyCost - avgPoolCost) * agencyShifts.length;
      
      // Calculate unfilled shift waste
      const unfilledHighPriority = mockShifts.filter(s => s.status === 'Unfilled' && s.priority === 'High').length;
      const lastMinuteFillCost = unfilledHighPriority * 150; // Estimated premium for last-minute fills
      
      return {
        type: "data",
        title: "Cost Savings Opportunities",
        message: `Identified $${Math.round(potentialSavingsPool + lastMinuteFillCost).toLocaleString()} in potential monthly savings:`,
        stats: {
          total: `$${Math.round(potentialSavingsPool + lastMinuteFillCost).toLocaleString()}`,
          agencyOptimization: `$${Math.round(potentialSavingsPool).toLocaleString()}`,
          preventableWaste: `$${lastMinuteFillCost.toLocaleString()}`,
        },
        data: [
          { 
            label: "Use Pool Instead of Agency", 
            value: `$${Math.round(potentialSavingsPool).toLocaleString()} potential savings`, 
            status: "warning",
            detail: `${agencyShifts.length} agency shifts could use permanent pool staff (40% savings)`
          },
          { 
            label: "Use Casual Bank vs Agency", 
            value: `$${Math.round(potentialSavingsBank).toLocaleString()} potential savings`, 
            status: "warning",
            detail: `Casual bank staff (125%) is 30% cheaper than agency`
          },
          { 
            label: "Proactive Shift Filling", 
            value: `$${lastMinuteFillCost.toLocaleString()} preventable premiums`, 
            status: "warning",
            detail: `${unfilledHighPriority} high-priority shifts risk last-minute premium rates`
          },
          { 
            label: "Preferred Provider Utilisation", 
            value: "15% rate improvement available", 
            status: "good",
            detail: "Priority Tier 1 providers offer better rates for bulk booking"
          },
          { 
            label: "Expand Permanent Pool", 
            value: `${poolShifts.length} pool shifts vs ${agencyShifts.length} agency`, 
            status: "good",
            detail: "Growing permanent pool reduces casual bank and agency dependency"
          },
        ],
        actions: [
          { label: "View Full Cost Report", primary: true },
          { label: "Optimise Workforce Mix", primary: false },
        ],
      };
    }

    // Overtime Analysis
    if (questionLower.includes("overtime") || questionLower.includes("overtime analysis") || questionLower.includes("extra hours")) {
      const filledShifts = mockShifts.filter(s => s.status === 'Filled');
      
      // Calculate overtime scenarios
      const standardShiftHours = 8;
      const overtimeShifts = filledShifts.filter(shift => {
        const start = parseInt(shift.startTime.split(':')[0]);
        const end = parseInt(shift.endTime.split(':')[0]);
        const hours = end > start ? end - start : (24 - start) + end;
        return hours > standardShiftHours;
      });
      
      // Estimate overtime costs (1.5x rate for hours over 8)
      const totalOvertimeHours = overtimeShifts.length * 2; // Estimate 2 hours OT per shift
      const avgHourlyRate = 55;
      const overtimeCost = totalOvertimeHours * avgHourlyRate * 1.5;
      
      // Find staff working excessive hours
      const highHoursStaff = mockStaff.filter(s => s.hoursThisMonth >= 160);
      const overtimeRiskStaff = mockStaff.filter(s => s.hoursThisMonth >= 150 && s.hoursThisMonth < 160);
      
      return {
        type: "data",
        title: "Overtime Analysis",
        message: `Current period overtime tracking and risk assessment:`,
        stats: {
          totalOTHours: totalOvertimeHours,
          overtimeCost: `$${overtimeCost.toLocaleString()}`,
          staffAtRisk: highHoursStaff.length,
        },
        data: [
          { 
            label: "Total Overtime Hours", 
            value: `${totalOvertimeHours} hours this period`, 
            status: "warning",
            detail: `${overtimeShifts.length} shifts with extended hours`
          },
          { 
            label: "Overtime Cost Impact", 
            value: `$${overtimeCost.toLocaleString()} at 1.5× rate`, 
            status: "warning",
            detail: "Additional 50% premium on extended hours"
          },
          { 
            label: "Staff Working >160 Hours", 
            value: `${highHoursStaff.length} staff at risk`, 
            status: highHoursStaff.length > 3 ? "critical" : "warning",
            detail: "Exceeding safe working hours, fatigue risk"
          },
          { 
            label: "Staff Approaching Limit", 
            value: `${overtimeRiskStaff.length} staff (150-160 hrs)`, 
            status: "warning",
            detail: "Monitor closely to prevent burnout"
          },
          { 
            label: "Workload Distribution", 
            value: `${mockStaff.filter(s => s.hoursThisMonth < 100).length} staff underutilized`, 
            status: "good",
            detail: "Opportunity to balance workload better"
          },
        ],
        actions: [
          { label: "View Utilization Report", primary: true },
          { label: "Balance Workload", primary: false },
        ],
      };
    }

    // Default response
    return {
      type: "general",
      title: "AI Assistant",
      message: "I can help you with:",
      data: [
        "• Creating and managing shift bookings",
        "• Finding available staff for shifts",
        "• Checking AHPRA and compliance status",
        "• Viewing open and urgent shifts",
        "• Staff performance and ratings",
        "• Generating reports and analytics",
        "• Facility and department information",
        "• Staff locations and deployment",
        "• Cost analysis and budget tracking",
        "• Skills and experience searches",
      ],
      actions: [
        { label: "View Dashboard", primary: true },
        { label: "Ask Another Question", primary: false },
      ],
    };
  };

  return (
    <>
      {/* AI Search Bar — compact single row */}
      <div className="mb-3">
        <button
          className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50/50 transition-all group shadow-sm"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center justify-center h-7 w-7 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex-shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="flex-1 text-left text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
            Ask AI anything… "Who needs AHPRA renewal?", "Show unfilled shifts today" or "Book a shift"
          </span>
          <div className="hidden md:flex items-center gap-1 text-[11px] text-gray-400">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-mono">K</kbd>
          </div>
          <Badge className="bg-purple-100 text-purple-600 border-0 text-[10px] px-1.5 py-0 font-semibold">AI</Badge>
        </button>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <DialogTitle>NurseForce AI Assistant</DialogTitle>
              <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-purple-200">
                Powered by AI
              </Badge>
            </div>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Ask questions about shifts, staff, compliance, or bookings in natural language
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Suggested Prompts */}
            {!response && !isProcessing && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
                <div className="grid grid-cols-2 gap-2">
                  {currentFilters.map((prompt, index) => (
                    <Card
                      key={index}
                      className="p-3 hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-colors"
                      onClick={() => handleSubmit(prompt)}
                    >
                      <p className="text-sm text-gray-700">{prompt}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Processing your request...</p>
                </div>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{response.title}</h3>
                      <p className="text-sm text-gray-700">{response.message}</p>
                    </div>
                  </div>
                </Card>

                {/* Stats Display */}
                {response.stats && (
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(response.stats).map(([key, value]: [string, any]) => (
                      <Card key={key} className="p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-600 capitalize mt-1">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Data Display */}
                {response.data && Array.isArray(response.data) && (
                  <div className="space-y-2">
                    {response.data.map((item: any, index: number) => (
                      <Card key={index} className="p-4">
                        {typeof item === "string" ? (
                          <p className="text-sm text-gray-700">{item}</p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(item).map(([key, value]: [string, any]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {key === "priority" && value === "High" ? (
                                    <Badge className="bg-[#BBDEFB] text-[#1565C0]">{value}</Badge>
                                  ) : key === "status" && value === "Urgent" ? (
                                    <Badge className="bg-orange-100 text-orange-700">{value}</Badge>
                                  ) : key === "rating" ? (
                                    <span className="flex items-center gap-1">
                                      ⭐ {value}
                                    </span>
                                  ) : (
                                    value
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {response.actions && (
                  <div className="flex gap-2 pt-2">
                    {response.actions.map((action: any, index: number) => {
                      // Skip "Ask Another Question" since we have a dedicated button below
                      if (action.label.toLowerCase().includes('ask another')) return null;
                      
                      return (
                        <Button
                          key={index}
                          variant={action.primary ? "default" : "outline"}
                          className={action.primary ? "bg-[#005DAA] hover:bg-[#004B8F]" : ""}
                          onClick={() => handleActionClick(action.label)}
                        >
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                )}

                {/* Ask Another Question */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    setResponse(null);
                    setIsExpanded(false);
                  }}
                >
                  Ask Another Question
                </Button>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your question here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                className="flex-1"
              />
              <Button
                onClick={() => handleSubmit()}
                disabled={!query.trim() || isProcessing}
                className="bg-[#005DAA] hover:bg-[#004B8F]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}