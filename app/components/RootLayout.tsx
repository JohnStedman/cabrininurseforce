import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Calendar, Users, Building2, ClipboardCheck, MapPin, ShieldCheck, DollarSign, ChartBar as BarChart3, Cog, Shield, Menu, Search, Bell, Settings, ChevronDown, LogOut, CircleAlert as AlertCircle, CircleCheck as CheckCircle, CircleUser as UserCircle, UserCog, Sparkles, Clock, Circle as XCircle, FileText, TrendingUp, X, MessageSquare, Zap, CalendarDays } from "lucide-react";
import { Button } from "./ui/button";
import { AIAssistant } from "./AIAssistant";
import { LiveChat } from "./LiveChat";
import { CommandBar } from "./CommandBar";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { TorrensShellIcon } from "./TorrensShellIcon";
import torrensLogo from 'figma:asset/ef4d2891eec1e0481744f86101433476021ce26c.png';
import torrensLogoFull from '../../image-21.png';
import brandingBanner from '../../image-29.png';
import torrensShell from '../../assets/c4d493c87c3ef43fc72250fa5ac980042d53ce9e.png';
import cabriniLogo from '../../cabrini-logo-transparent.png';
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { mockProviders, mockProviderContractors, mockStaff } from "../data/mockData";
import { getShifts } from "../data/shiftStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

// Calculate unfilled shifts count
const unfilledShiftsCount = getShifts().filter(shift => shift.status === 'Unfilled').length;

const CABRINI_LOCATIONS = [
  'All',
  'Cabrini Malvern',
  'Cabrini Brighton',
  "Cabrini Women's Mental Health",
  'Cabrini Exercise and Wellness Centre',
  'Cabrini Local – Sorrento',
  'Cabrini Asylum Seeker and Refugee Health Hub',
  'Cabrini Elsternwick',
  'Patricia Peck'
];

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showUnfilledDialog, setShowUnfilledDialog] = useState(false);
  const [fillShiftTarget, setFillShiftTarget] = useState<any>(null);
  const [fillStep, setFillStep] = useState<1|2|3>(1);
  const [fillMethod, setFillMethod] = useState<'smart'|'manual'|'agency'>('smart');
  const [fillStaffPick, setFillStaffPick] = useState('');
  const [fillDone, setFillDone] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  
  // Get selected Cabrini location from localStorage
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem('cabriniLocation') || 'Cabrini Malvern');
  
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Workforce Management': true,
    'Agency Management': true,
    'Agency Portal': true
  });
  const [searchResults, setSearchResults] = useState<{
    staff: typeof mockStaff;
    contractors: typeof mockProviderContractors;
    providers: typeof mockProviders;
    shifts: ReturnType<typeof getShifts>;
  }>({ staff: [], contractors: [], providers: [], shifts: [] });

  // Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults({ staff: [], contractors: [], providers: [], shifts: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Search staff
    const staffResults = mockStaff.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.role.toLowerCase().includes(lowerQuery) ||
      s.ahpraRegistration.toLowerCase().includes(lowerQuery) ||
      s.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
    ).slice(0, 3);

    // Search contractors
    const contractorResults = mockProviderContractors.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.jobRole.toLowerCase().includes(lowerQuery) ||
      c.ahpraRegistration?.toLowerCase().includes(lowerQuery) ||
      c.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
    ).slice(0, 3);

    // Search providers
    const providerResults = mockProviders.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.primaryContact.name.toLowerCase().includes(lowerQuery) ||
      p.email.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    // Search shifts
    const shiftResults = getShifts().filter(s =>
      s.facility.toLowerCase().includes(lowerQuery) ||
      s.ward.toLowerCase().includes(lowerQuery) ||
      s.role.toLowerCase().includes(lowerQuery) ||
      s.assignedStaff?.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    setSearchResults({
      staff: staffResults,
      contractors: contractorResults,
      providers: providerResults,
      shifts: shiftResults
    });
  };

  // Handle result click
  const handleResultClick = (type: string, id: string) => {
    setSearchQuery('');
    setSearchResults({ staff: [], contractors: [], providers: [], shifts: [] });
    setSearchFocused(false);
    
    if (type === 'staff') {
      navigate('/staff');
      toast.success('Navigating to staff member', { description: `View details for ${id}` });
    } else if (type === 'contractor') {
      navigate('/contractors');
      toast.success('Navigating to contractor', { description: `View details for ${id}` });
    } else if (type === 'provider') {
      navigate(`/providers/${id}`);
    } else if (type === 'shift') {
      navigate('/shifts');
      toast.success('Navigating to shift', { description: `View details for ${id}` });
    }
  };

  const totalResults = searchResults.staff.length + searchResults.contractors.length + 
                       searchResults.providers.length + searchResults.shifts.length;
  const showResults = searchFocused && searchQuery.length >= 2 && totalResults > 0;
  
  // Context indicators for navigation items
  const getItemBadge = (name: string) => {
    switch (name) {
      case 'Shifts':
        return { count: unfilledShiftsCount, color: 'bg-blue-600', label: 'unfilled' };
      case 'Compliance':
        return { count: 2, color: 'bg-orange-500', label: 'expiring' };
      case 'Smart Match':
        return { count: 4, color: 'bg-purple-500', label: 'ready', icon: '⚡' };
      default:
        return null;
    }
  };

  // Get contextual action based on current page
  const getContextualAction = () => {
    if (location.pathname.startsWith('/shifts')) {
      return { label: '⚡ Auto Fill Shift', path: '/shifts' };
    } else if (location.pathname.startsWith('/smart-match')) {
      return { label: '⚡ Assign Best Candidate', path: '/smart-match' };
    } else if (location.pathname.startsWith('/contractors')) {
      return { label: '+ Add Agency Staff', path: '/contractors' };
    } else if (location.pathname.startsWith('/providers')) {
      return { label: '+ Add Provider', path: '/providers' };
    } else if (location.pathname.startsWith('/staff')) {
      return { label: '+ Add Staff Member', path: '/staff' };
    } else if (location.pathname.startsWith('/timesheets')) {
      return { label: 'Approve Timesheets', path: '/timesheets' };
    } else if (location.pathname.startsWith('/compliance')) {
      return { label: 'Review Expiring', path: '/compliance' };
    } else if (location.pathname.startsWith('/reports')) {
      return { label: 'Export Report', path: '/reports' };
    } else if (location.pathname.startsWith('/costing')) {
      return { label: '⚡ Optimise Cost', path: '/costing' };
    } else if (location.pathname === '/') {
      return { label: '⚡ Auto Fill Shift', path: '/' };
    }
    return { label: '+ Quick Action', path: '/' };
  };

  const contextualAction = getContextualAction();

  // Handle quick action button click
  const handleQuickAction = () => {
    if (location.pathname.startsWith('/shifts')) {
      toast.success('Opening shift creation form...', {
        description: 'Create a new shift for Cabrini Malvern',
      });
    } else if (location.pathname.startsWith('/smart-match')) {
      toast.success('⚡ AI Auto-Assignment initiated', {
        description: 'Analyzing 4 unfilled shifts and matching with available contractors...',
      });
      // Simulate processing
      setTimeout(() => {
        toast.success('✅ Auto-assignment complete', {
          description: '4 shifts assigned to best-matched contractors',
        });
      }, 2500);
    } else if (location.pathname.startsWith('/contractors')) {
      toast.success('Opening contractor registration form...', {
        description: 'Add a new contractor to your workforce',
      });
    } else if (location.pathname.startsWith('/providers')) {
      toast.success('Opening provider registration form...', {
        description: 'Register a new healthcare provider',
      });
    } else if (location.pathname.startsWith('/staff')) {
      toast.success('Opening staff member form...', {
        description: 'Add a new staff member to the system',
      });
    } else if (location.pathname.startsWith('/timesheets')) {
      toast.success('Creating new timesheet...', {
        description: 'Starting timesheet entry for current period',
      });
    } else if (location.pathname.startsWith('/compliance')) {
      toast.info('Reviewing expiring credentials...', {
        description: '2 credentials expiring in the next 30 days',
      });
    } else if (location.pathname.startsWith('/reports')) {
      toast.success('Opening report generator...', {
        description: 'Create custom reports and analytics',
      });
    } else if (location.pathname.startsWith('/costing')) {
      toast.success('⚡ Optimising cost...', {
        description: 'Analyzing workforce budgeting and cost optimisation',
      });
    } else {
      toast.success('Opening shift creation...', {
        description: 'Quick action: Create a new shift',
      });
    }
  };
  
  const navigation = [
    // OPERATIONS
    { name: 'Coverage', path: '/', icon: LayoutDashboard, section: 'OPERATIONS' },
    { name: 'Staff Deployment', path: '/deployment', icon: MapPin, section: 'OPERATIONS' },
    { name: 'Allocation & Scheduling', path: '/shifts', icon: Calendar, section: 'OPERATIONS' },
    { name: 'Smart Match', path: '/smart-match', icon: Sparkles, section: 'SYSTEM', highlighted: true },
    
    // WORKFORCE MANAGEMENT
    { 
      name: 'Workforce Management', 
      path: '/staff', 
      icon: Users, 
      section: 'WORKFORCE MANAGEMENT',
      children: [
        { name: 'All Staff', path: '/staff' },
        { name: 'Hospital Staff', path: '/staff?type=internal', count: 5 },
        { name: 'Casual Bank', path: '/staff?type=bank', count: 2 },
        { name: 'Agency Staff', path: '/staff?type=agency', count: 3 }
      ]
    },
    { 
      name: 'Agency Management', 
      path: '/providers', 
      icon: Building2, 
      section: 'WORKFORCE MANAGEMENT',
      children: [
        { name: 'Agencies', path: '/providers' }
      ]
    },
    
    // AGENCY PORTAL (Separate section for agency login)
    { name: 'Agency Dashboard', path: '/agency-dashboard', icon: Building2, section: 'SYSTEM' },
    
    // EXECUTION
    { name: 'Timesheets & Approvals', path: '/timesheets', icon: ClipboardCheck, section: 'EXECUTION' },
    
    // COMPLIANCE
    { name: 'Compliance', path: '/compliance', icon: ShieldCheck, section: 'COMPLIANCE' },
    
    // FINANCIAL CONTROL
    { name: 'Workforce Budgeting', path: '/costing', icon: DollarSign, section: 'SYSTEM' },
    { name: 'Reporting & Analytics', path: '/reports', icon: BarChart3, section: 'FINANCIAL CONTROL' },
    
    // SYSTEM
    { name: 'Communications', path: '/communications', icon: MessageSquare, section: 'WORKFORCE MANAGEMENT' },
    { name: 'Audit Log', path: '/audit-log', icon: Shield, section: 'WORKFORCE MANAGEMENT' },
    { name: 'Admin', path: '/admin', icon: Cog, section: 'SYSTEM' },
    { name: 'Sign Out', path: '/login', icon: LogOut, section: 'SYSTEM', onClick: () => {
      localStorage.removeItem('cabriniLocation');
      navigate('/login');
    } } 
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Group navigation items by section
  const groupedNavigation = navigation.reduce((acc, item) => {
    const section = item.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, typeof navigation>);

  const sectionOrder = ['OPERATIONS', 'WORKFORCE MANAGEMENT', 'EXECUTION', 'COMPLIANCE', 'FINANCIAL CONTROL', 'SYSTEM'];

  return (
    <div className="min-h-screen bg-[#F3F6FA]">
      {/* ── Header — white with charcoal + red ── */}
      <header className="bg-white border-b border-[rgba(26,43,60,0.10)] fixed top-0 left-0 right-0 z-30 shadow-sm">
        <div className="flex items-center justify-between gap-2 md:gap-4 px-3 md:px-5" style={{ height: '58px' }}>

          {/* Left: Logo + Branding */}
          <div className="flex items-center gap-2 md:gap-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[#64748B] hover:text-[#1565C0] hover:bg-[#E8F0FE] p-2 min-h-[44px] min-w-[44px] rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2.5">
              {/* NF logo mark */}
              <div className="h-9 w-9 rounded-xl bg-[#1B2A85] flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-[13px] font-extrabold text-white tracking-tight leading-none">NF</span>
              </div>
              {/* Wordmark */}
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-bold text-[#1A2B3C] tracking-tight">NurseForce</span>
                <span className="text-[10px] text-[#64748B] hidden sm:block">by Torrens Health</span>
              </div>
            </div>

            {/* Location chip */}
            <div className="hidden xl:flex items-center gap-2 ml-2 pl-5 border-l border-[rgba(26,43,60,0.10)]">
              <MapPin className="h-3.5 w-3.5 text-[#1565C0]" />
              <div>
                <div className="text-[13px] font-medium text-[#1A2B3C] leading-tight">{selectedLocation}</div>
                <div className="text-[11px] text-white/35">Emergency Dept · Today</div>
              </div>
            </div>
          </div>

          {/* Centre: Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
              <input
                type="text"
                placeholder="Search staff, shifts, providers…"
                className="w-full bg-white/[0.10] border border-white/[0.15] rounded-lg pl-10 pr-4 py-2 text-sm text-[#1B3569] placeholder:text-[#A8BDD6] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/30 focus:border-[#1565C0]/40 transition-all"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              {showResults && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white border border-black/[0.09] rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
                  <div className="p-3">
                    <p className="text-[11px] text-[#999] mb-2 px-1">Results for "{searchQuery}"</p>
                    {searchResults.staff.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] text-[#AAA] uppercase tracking-widest mb-1.5 px-2 font-semibold">Staff</p>
                        {searchResults.staff.map(s => (
                          <button key={s.id} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F4F4F4] transition-colors text-left" onMouseDown={(e) => { e.preventDefault(); handleResultClick('staff', s.name); }}>
                            <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0"><UserCircle className="h-4 w-4 text-blue-500" /></div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#36454F] truncate">{s.name}</p><p className="text-xs text-[#888]">{s.role} · {s.status}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults.contractors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] text-[#AAA] uppercase tracking-widest mb-1.5 px-2 font-semibold">Casual & Pool</p>
                        {searchResults.contractors.map(c => (
                          <button key={c.id} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F4F4F4] transition-colors text-left" onMouseDown={(e) => { e.preventDefault(); handleResultClick('contractor', c.name); }}>
                            <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0"><UserCog className="h-4 w-4 text-purple-500" /></div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#36454F] truncate">{c.name}</p><p className="text-xs text-[#888]">{c.jobRole} · {c.status}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults.providers.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] text-[#AAA] uppercase tracking-widest mb-1.5 px-2 font-semibold">Providers</p>
                        {searchResults.providers.map(p => (
                          <button key={p.id} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F4F4F4] transition-colors text-left" onMouseDown={(e) => { e.preventDefault(); handleResultClick('provider', p.id); }}>
                            <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0"><Building2 className="h-4 w-4 text-emerald-600" /></div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#36454F] truncate">{p.name}</p><p className="text-xs text-[#888]">Tier {p.priorityTier} · {p.contractorCount} contractors</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults.shifts.length > 0 && (
                      <div>
                        <p className="text-[10px] text-[#AAA] uppercase tracking-widest mb-1.5 px-2 font-semibold">Shifts</p>
                        {searchResults.shifts.map(s => (
                          <button key={s.id} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F4F4F4] transition-colors text-left" onMouseDown={(e) => { e.preventDefault(); handleResultClick('shift', s.id); }}>
                            <div className="h-8 w-8 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0"><Calendar className="h-4 w-4 text-amber-500" /></div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#36454F] truncate">{s.facility} – {s.ward}</p><p className="text-xs text-[#888]">{s.role} · {s.date} · {s.status}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="sm" className="md:hidden text-[#64748B] hover:text-[#1565C0] hover:bg-[#E8F0FE] min-h-[44px] min-w-[44px] p-2 rounded-lg" onClick={() => toast.info('Mobile search coming soon')}>
              <Search className="h-[18px] w-[18px]" />
            </Button>

            {/* Unfilled chip */}
            <button onClick={() => setShowUnfilledDialog(true)} className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors min-h-[36px]">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[12px] font-semibold text-amber-700">{unfilledShiftsCount} unfilled</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="text-[#64748B] hover:text-[#1565C0] hover:bg-[#E8F0FE] min-h-[44px] min-w-[44px] p-2 rounded-lg" onClick={() => setNotificationsOpen(!notificationsOpen)}>
                <Bell className="h-[18px] w-[18px]" />
              </Button>
              <span className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] bg-[#1565C0] rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">3</span>
            </div>

            <Button variant="ghost" size="sm" className="hidden sm:flex text-[#64748B] hover:text-[#1565C0] hover:bg-[#E8F0FE] min-h-[44px] min-w-[44px] p-2 rounded-lg">
              <Settings className="h-[18px] w-[18px]" />
            </Button>

            <div className="hidden sm:block w-px h-6 bg-[rgba(26,43,60,0.10)] mx-1" />

            {/* User */}
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 hover:bg-[#E8F0FE] rounded-lg px-2 py-1.5 transition-all min-h-[44px]">
                <div className="h-8 w-8 bg-[#1565C0] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-white">CC</span>
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[13px] font-semibold text-[#1A2B3C] leading-tight">Cassie Cruddschmidt</div>
                  <div className="text-[10px] text-[#6B7280]">Coordinator</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8] hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-black/[0.09] rounded-xl shadow-lg py-1.5 z-50">
                  <div className="px-3 py-2.5 border-b border-black/[0.07]">
                    <p className="text-[10px] text-[#AAA] uppercase tracking-wider mb-0.5">Signed in as</p>
                    <p className="text-sm font-medium text-[#36454F]">cruddschmidt@cabrini.com.au</p>
                  </div>
                  <button onClick={() => { setShowLocationDialog(true); setUserMenuOpen(false); }} className="w-full px-3 py-2.5 text-left text-sm text-[#555] hover:text-[#36454F] hover:bg-[#F4F4F4] transition-colors flex items-center gap-2.5">
                    <Building2 className="h-4 w-4" />Switch Location
                  </button>
                  <button className="w-full px-3 py-2.5 text-left text-sm text-[#555] hover:text-[#36454F] hover:bg-[#F4F4F4] transition-colors flex items-center gap-2.5">
                    <Settings className="h-4 w-4" />Settings
                  </button>
                  <div className="border-t border-black/[0.07] mt-1 pt-1">
                    <button onClick={() => { localStorage.removeItem('cabriniLocation'); navigate('/login'); }} className="w-full px-3 py-2.5 text-left text-sm text-[#1565C0] hover:bg-[#E3F2FD] transition-colors flex items-center gap-2.5">
                      <LogOut className="h-4 w-4" />Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Sidebar — white with charcoal nav ── */}
      <aside
        className={`fixed left-0 bottom-0 w-64 bg-white border-r border-black/[0.08] transition-transform duration-[220ms] ease-in-out z-20 overflow-y-auto shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ top: '58px' }}
      >
        <nav className="p-3 pt-4 space-y-4 pb-40">
          {sectionOrder.map((section, sectionIndex) => (
            <div key={section} className={sectionIndex > 0 ? 'pt-1 border-t border-[#C8D5E8]/60' : ''}>
              <p className="text-[10px] font-bold text-[#7A93B8] uppercase tracking-[0.12em] mb-1.5 px-3 pt-3">{section}</p>
              <div className="space-y-0.5">
                {groupedNavigation[section].map((item: any) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  const badge = getItemBadge(item.name);
                  const isSmartMatch = item.name === 'Smart Match';
                  const isAgencyDashboard = item.name === 'Agency Dashboard';
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.path}>
                      {!hasChildren ? (
                        <Link
                          to={item.path}
                          onClick={() => {
                            if (window.innerWidth < 1024) setSidebarOpen(false);
                            if (item.onClick) item.onClick();
                          }}
                          className={`group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-[130ms] ease-out ${
                            active
                              ? isSmartMatch
                                ? 'bg-[#7F56D9] text-white shadow-sm'
                                : isAgencyDashboard
                                  ? 'bg-[#BE185D] text-white shadow-sm'
                                  : 'bg-[#1565C0] text-white shadow-sm'
                              : 'text-[#374151] hover:text-[#4263EB] hover:bg-[#EEF2FF]'
                          }`}
                          style={{ minHeight: '44px' }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Icon className={`h-[18px] w-[18px] flex-shrink-0 transition-all duration-[130ms] ${active ? 'text-white' : 'text-[#9CA3AF] group-hover:text-[#4263EB]'}`} />
                            <span className={`text-[13.5px] font-medium transition-all duration-[130ms] ${active ? 'text-white' : 'text-[#374151] group-hover:text-[#4263EB]'}`}>{item.name === 'Coverage' ? 'Dashboard' : item.name}</span>
                            {isSmartMatch && !badge && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-[#EEF2FF] text-[#4263EB] rounded font-bold tracking-wide">AI</span>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 px-3 py-2 mb-0.5">
                            <Icon className="h-[18px] w-[18px] text-white/35" />
                            <span className="text-[13px] font-semibold text-white/35">{item.name}</span>
                          </div>
                          <div className="ml-3 space-y-0.5 pl-3 border-l border-[rgba(26,43,60,0.10)]">
                            {item.children.map((child: any) => {
                              const childActive = child.path && (
                                child.path === location.pathname ||
                                location.pathname + location.search === child.path
                              );
                              return (
                                <Link
                                  key={child.path}
                                  to={child.path}
                                  onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all duration-[130ms] ${
                                    childActive
                                      ? 'bg-[#E3F2FD] text-[#1565C0] font-semibold'
                                      : 'text-[#374151] hover:text-[#4263EB] hover:bg-[#EEF2FF]'
                                  }`}
                                  style={{ minHeight: '36px' }}
                                >
                                  <span className="text-[13px]">{child.name}</span>
                                  {child.count != null && (
                                    <span className={`text-[11px] min-w-[22px] text-center px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                                      childActive ? 'bg-[#BBDEFB] text-[#1565C0]' : 'bg-[#F3F4F6] text-[#9CA3AF]'
                                    }`}>{child.count}</span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Torrens Health footer */}
          <div className="mt-4 mx-1 rounded-xl overflow-hidden border border-white/[0.10]">
            {/* Branding banner — image-27 */}
            <div className="h-[72px] overflow-hidden">
              <img src={brandingBanner} alt="Torrens Health" className="w-full h-full object-cover object-left-top" />
            </div>
            {/* User manual link */}
            <Link to="/user-manual" className="flex items-center gap-2 px-3 py-2.5 text-[#64748B] hover:text-[#1565C0] hover:bg-[#E8F0FE] transition-colors border-t border-[rgba(26,43,60,0.08)] bg-white">
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span className="text-[12px] font-medium">User Manual</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className={`transition-all duration-[220ms] ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`} style={{ paddingTop: '58px' }}>
        <div className="p-3 sm:p-4 md:p-6 min-h-[calc(100vh-58px)] bg-[#F3F6FA]">
          <AIAssistant />
          <LiveChat />
          <CommandBar />
          <AIAssistantPanel />
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Unfilled Shifts Dialog */}
      <Dialog open={showUnfilledDialog} onOpenChange={setShowUnfilledDialog}>
        <DialogContent className="w-[95vw] max-w-[560px] max-h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-black/[0.07] flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <div className="h-7 w-7 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              Unfilled Shifts
              <span className="ml-1 text-sm font-normal text-[#888]">({unfilledShiftsCount} requiring action)</span>
            </DialogTitle>
            <DialogDescription>Shifts currently without an assigned staff member</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto divide-y divide-black/[0.05]">
            {getShifts().filter(s => s.status === 'Unfilled').slice(0, 15).map(shift => {
              const priorityColor = shift.priority === 'High' ? 'text-[#1565C0] bg-[#E3F2FD] border-[#90CAF9]' : shift.priority === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-gray-600 bg-gray-50 border-gray-200';
              return (
                <div key={shift.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#F9F9F9] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-[#1B3569] truncate">{shift.ward}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}>{shift.priority}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#888] flex-wrap">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{shift.startTime}–{shift.endTime}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{shift.facility}</span>
                      <span>{shift.role}</span>
                      <span>{new Date(shift.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowUnfilledDialog(false); setFillShiftTarget(shift); setFillStep(1); setFillMethod('smart'); setFillStaffPick(''); setFillDone(false); }}
                    className="text-[12px] font-semibold text-[#1565C0] hover:text-[#1251A0] hover:bg-[#E3F2FD] px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 min-h-[36px]"
                  >
                    Fill Now
                  </button>
                </div>
              );
            })}
          </div>
          <div className="px-6 py-3.5 border-t border-black/[0.07] bg-[#F9F9F9] flex items-center justify-between flex-shrink-0">
            <p className="text-[11px] text-[#888]">{unfilledShiftsCount} total unfilled shifts</p>
            <button onClick={() => { setShowUnfilledDialog(false); navigate('/shifts'); }} className="text-sm font-semibold text-[#1565C0] hover:text-[#1251A0] transition-colors">
              View All in Allocation →
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fill Shift Dialog */}
      <Dialog open={!!fillShiftTarget && !fillDone} onOpenChange={() => { setFillShiftTarget(null); setFillStep(1); }}>
        <DialogContent className="w-[95vw] max-w-[520px] p-0 gap-0 flex flex-col max-h-[85vh]">
          {/* Header */}
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-black/[0.07] flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <div className="h-7 w-7 bg-[#1565C0]/10 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-[#1565C0]" />
              </div>
              Fill Shift
              <span className="ml-1 text-sm font-normal text-[#888]">Step {fillStep} of 3</span>
            </DialogTitle>
            <DialogDescription>
              {fillShiftTarget?.ward} · {fillShiftTarget?.facility} · {fillShiftTarget?.startTime}–{fillShiftTarget?.endTime} · {fillShiftTarget?.role}
            </DialogDescription>
          </DialogHeader>

          {/* Step progress */}
          <div className="flex px-6 pt-4 gap-2">
            {[{ n: 1, label: 'Method' }, { n: 2, label: 'Select Staff' }, { n: 3, label: 'Confirm' }].map(s => (
              <div key={s.n} className="flex-1">
                <div className={`h-1.5 rounded-full ${fillStep >= s.n ? 'bg-[#1565C0]' : 'bg-[#EBEBEB]'}`} />
                <p className={`text-[10px] font-bold mt-1 uppercase tracking-wide ${fillStep >= s.n ? 'text-[#1565C0]' : 'text-[#BBB]'}`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Step 1 — method */}
          {fillStep === 1 && (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              <p className="text-sm text-[#555] mb-2">How would you like to fill this shift?</p>
              {[
                { key: 'smart', icon: Sparkles, label: 'AI Smart Match', sub: 'Automatically find the best available staff member based on skills, compliance and location', tag: 'Recommended' },
                { key: 'manual', icon: Users, label: 'Manual Selection', sub: 'Browse and select from available internal staff, bank pool or casual staff', tag: '' },
                { key: 'agency', icon: Building2, label: 'Request from Agency', sub: 'Send a shift request to your preferred agency providers', tag: '' },
              ].map(opt => (
                <button key={opt.key} onClick={() => setFillMethod(opt.key as any)} className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${fillMethod === opt.key ? 'border-[#1565C0] bg-[#E3F2FD]' : 'border-black/[0.08] hover:border-black/[0.15] bg-white'}`}>
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${fillMethod === opt.key ? 'bg-[#1565C0]/10' : 'bg-[#F4F4F4]'}`}>
                    <opt.icon className={`h-4 w-4 ${fillMethod === opt.key ? 'text-[#1565C0]' : 'text-[#555]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#1B3569]">{opt.label}</p>
                      {opt.tag && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{opt.tag}</span>}
                    </div>
                    <p className="text-[11px] text-[#888] mt-0.5 leading-relaxed">{opt.sub}</p>
                  </div>
                  {fillMethod === opt.key && <CheckCircle className="h-5 w-5 text-[#1565C0] flex-shrink-0 mt-1" />}
                </button>
              ))}
            </div>
          )}

          {/* Step 2 — select staff */}
          {fillStep === 2 && (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {fillMethod === 'smart' && (
                <>
                  <div className="flex items-center gap-2.5 p-3 bg-violet-50 rounded-xl border border-violet-200 mb-1">
                    <Sparkles className="h-4 w-4 text-violet-600 flex-shrink-0" />
                    <p className="text-[12px] text-violet-700">AI has ranked available staff by best match for this shift.</p>
                  </div>
                  {mockStaff.filter(s => s.status === 'Available').slice(0, 4).map((s, i) => {
                    const score = 98 - i * 4;
                    return (
                      <button key={s.id} onClick={() => setFillStaffPick(s.name)} className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${fillStaffPick === s.name ? 'border-[#1565C0] bg-[#E3F2FD]' : 'border-black/[0.08] hover:border-black/[0.15] bg-white'}`}>
                        <div className="h-9 w-9 rounded-full bg-[#EEF2F7] flex items-center justify-center text-xs font-bold text-[#1B3569] flex-shrink-0">{s.name.split(' ').map((n:string)=>n[0]).join('')}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1B3569] truncate">{s.name}</p>
                          <p className="text-[11px] text-[#888]">{s.role} · {s.complianceStatus}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[11px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">{score}% match</span>
                          {i === 0 && <span className="text-[9px] font-bold text-emerald-600">Best match</span>}
                        </div>
                        {fillStaffPick === s.name && <CheckCircle className="h-5 w-5 text-[#1565C0] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </>
              )}
              {fillMethod === 'manual' && (
                <>
                  <p className="text-sm text-[#555] mb-1">Select an available staff member:</p>
                  {mockStaff.filter(s => s.status === 'Available').slice(0, 6).map(s => (
                    <button key={s.id} onClick={() => setFillStaffPick(s.name)} className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${fillStaffPick === s.name ? 'border-[#1565C0] bg-[#E3F2FD]' : 'border-black/[0.08] hover:border-black/[0.15] bg-white'}`}>
                      <div className="h-9 w-9 rounded-full bg-[#EEF2F7] flex items-center justify-center text-xs font-bold text-[#1B3569] flex-shrink-0">{s.name.split(' ').map((n:string)=>n[0]).join('')}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1B3569] truncate">{s.name}</p>
                        <p className="text-[11px] text-[#888]">{s.role} · {s.yearsExperience} yrs exp · {s.complianceStatus}</p>
                      </div>
                      {fillStaffPick === s.name && <CheckCircle className="h-5 w-5 text-[#1565C0] flex-shrink-0" />}
                    </button>
                  ))}
                </>
              )}
              {fillMethod === 'agency' && (
                <div className="space-y-3">
                  <p className="text-sm text-[#555]">A shift request will be sent to your preferred agencies:</p>
                  {['Your Nursing Agency — Tier 1', 'XYZ Medical — Tier 2', 'Green Healthcare — Tier 3'].map((a, i) => (
                    <button key={a} onClick={() => setFillStaffPick(a)} className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${fillStaffPick === a ? 'border-[#1565C0] bg-[#E3F2FD]' : 'border-black/[0.08] hover:border-black/[0.15] bg-white'}`}>
                      <div className="h-9 w-9 rounded-lg bg-[#EEF2F7] flex items-center justify-center flex-shrink-0"><Building2 className="h-4 w-4 text-[#1B3569]" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1B3569]">{a}</p>
                        <p className="text-[11px] text-[#888]">{i === 0 ? 'Preferred partner' : 'Active contract'}</p>
                      </div>
                      {fillStaffPick === a && <CheckCircle className="h-5 w-5 text-[#1565C0] flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3 — confirm */}
          {fillStep === 3 && fillShiftTarget && (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="bg-[#F4F4F4] rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-[#888] uppercase tracking-wider mb-2">Shift Details</p>
                {[
                  { label: 'Ward', value: fillShiftTarget.ward },
                  { label: 'Facility', value: fillShiftTarget.facility },
                  { label: 'Date', value: new Date(fillShiftTarget.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }) },
                  { label: 'Time', value: `${fillShiftTarget.startTime}–${fillShiftTarget.endTime}` },
                  { label: 'Role', value: fillShiftTarget.role },
                  { label: 'Priority', value: fillShiftTarget.priority },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">{f.label}</span>
                    <span className="font-semibold text-[#1B3569]">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#1B3569]">{fillMethod === 'agency' ? 'Agency Request' : 'Assigned'}: {fillStaffPick}</p>
                  <p className="text-[11px] text-[#888]">{fillMethod === 'agency' ? 'Request will be sent immediately' : 'SMS confirmation will be sent'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/[0.07] bg-[#FAFAFA] flex-shrink-0 gap-2">
            <button onClick={() => fillStep > 1 ? setFillStep((fillStep - 1) as 1|2|3) : setFillShiftTarget(null)} className="text-sm text-[#555] hover:text-[#1B3569] font-medium transition-colors min-h-[44px] px-3">
              {fillStep === 1 ? 'Cancel' : '← Back'}
            </button>
            {fillStep < 3 ? (
              <button
                onClick={() => setFillStep((fillStep + 1) as 2|3)}
                disabled={fillStep === 2 && !fillStaffPick}
                className="bg-[#1565C0] hover:bg-[#1251A0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center gap-1.5"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={() => {
                  setFillDone(true);
                  setFillShiftTarget(null);
                  toast.success('Shift filled', { description: `${fillShiftTarget?.ward} assigned to ${fillStaffPick}` });
                }}
                className="bg-[#1565C0] hover:bg-[#1251A0] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center gap-1.5"
              >
                <CheckCircle className="h-4 w-4" />Confirm & Fill Shift
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Switch Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="w-[95vw] max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#1565C0]" />
              Switch Cabrini Location
            </DialogTitle>
            <DialogDescription>
              Select a Cabrini location to switch your workspace context
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 py-4">
            {CABRINI_LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  localStorage.setItem('cabriniLocation', loc);
                  setSelectedLocation(loc);
                  setShowLocationDialog(false);
                  toast.success('Location changed', {
                    description: `Switched to ${loc}`,
                  });
                  // Reload the page to update all location references
                  window.location.reload();
                }}
                className={`flex items-center justify-between gap-3 p-4 rounded-lg border-2 transition-all hover:bg-gray-50 ${
                  selectedLocation === loc
                    ? 'border-[#1565C0] bg-[#E3F2FD]'
                    : 'border-gray-200 hover:border-[#1565C0]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    selectedLocation === loc ? 'bg-[#1565C0]' : 'bg-gray-100'
                  }`}>
                    <Building2 className={`h-5 w-5 ${
                      selectedLocation === loc ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${
                      selectedLocation === loc ? 'text-[#1565C0]' : 'text-gray-900'
                    }`}>{loc}</p>
                  </div>
                </div>
                {selectedLocation === loc && (
                  <CheckCircle className="h-5 w-5 text-[#1565C0]" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Panel */}
      {notificationsOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setNotificationsOpen(false)}
          />
          
          {/* Notifications Dropdown */}
          <div className="fixed right-2 md:right-5 w-[95vw] max-w-96 bg-white border border-[rgba(26,22,20,0.10)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] z-50 max-h-[600px] overflow-hidden" style={{ top: '66px' }}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-black/[0.08] bg-[#36454F]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="h-4 w-4 text-white/80" />
                  <h3 className="font-semibold text-white text-sm">Notifications</h3>
                  <span className="text-[10px] bg-[#1565C0] text-white px-2 py-0.5 rounded-full font-bold">3 new</span>
                </div>
                <button onClick={() => setNotificationsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {/* Urgent Notification */}
              <div className="p-4 border-b border-gray-200 bg-[#E3F2FD] hover:bg-[#BBDEFB] transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-[#BBDEFB] rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-[#1565C0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">Urgent: 4 Unfilled Shifts</p>
                      <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">URGENT</span>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">Emergency Department requires immediate coverage for tonight's shifts</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Alert */}
              <div className="p-4 border-b border-gray-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">Compliance Expiring Soon</p>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">2 staff members have AHPRA registrations expiring within 30 days</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Alert */}
              <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">Supplemental Spend Increasing</p>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">Agency spend up 8% this month - $51.2K above roster cost</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earlier Notifications - Read */}
              <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer opacity-60">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Timesheet Approved</p>
                    <p className="text-xs text-gray-700 mb-2">Sophie Palmer's timesheet for Week 12 has been approved</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer opacity-60">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">New Staff Member Added</p>
                    <p className="text-xs text-gray-700 mb-2">Rachel Green has been added to the permanent pool</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer opacity-60">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Weekly Report Available</p>
                    <p className="text-xs text-gray-700 mb-2">Your workforce analytics report for Week 12 is ready to download</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-[#F9F8F6]">
              <button className="w-full text-sm font-medium text-[#1565C0] hover:text-[#1251A0] transition-colors">
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}