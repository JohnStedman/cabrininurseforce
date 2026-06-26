import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Search,
  Users,
  Calendar,
  AlertTriangle,
  FileText,
  Settings,
  BarChart3,
  Clock,
  Shield,
  Zap,
  User,
  MapPin,
  TrendingUp,
  BookOpen,
  Sparkles,
  Brain,
  ChevronRight
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: any;
  category: 'navigation' | 'action' | 'search';
  action: () => void;
  keywords?: string[];
}

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands: Command[] = [
    // Navigation Commands
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'View main dashboard',
      icon: BarChart3,
      category: 'navigation',
      action: () => {
        navigate('/');
        setOpen(false);
      },
      keywords: ['home', 'main', 'overview']
    },
    {
      id: 'nav-deployment',
      label: 'Staff Deployment',
      description: 'View staff deployed across all locations',
      icon: MapPin,
      category: 'navigation',
      action: () => {
        navigate('/deployment');
        setOpen(false);
      },
      keywords: ['deployment', 'deployed', 'location', 'staff', 'live']
    },
    {
      id: 'nav-shifts',
      label: 'Shift Allocation',
      description: 'Manage shift scheduling',
      icon: Calendar,
      category: 'navigation',
      action: () => {
        navigate('/shift-allocation');
        setOpen(false);
      },
      keywords: ['shifts', 'schedule', 'roster', 'allocation']
    },
    {
      id: 'nav-smart-match',
      label: 'Smart Match',
      description: 'AI-powered staff matching',
      icon: Zap,
      category: 'navigation',
      action: () => {
        navigate('/smart-match');
        setOpen(false);
      },
      keywords: ['match', 'ai', 'smart', 'recommend']
    },
    {
      id: 'nav-staff',
      label: 'Staff Management',
      description: 'View and manage staff',
      icon: Users,
      category: 'navigation',
      action: () => {
        navigate('/staff-management');
        setOpen(false);
      },
      keywords: ['staff', 'team', 'nurses', 'workers']
    },
    {
      id: 'nav-providers',
      label: 'Provider Network',
      description: 'Manage provider relationships',
      icon: MapPin,
      category: 'navigation',
      action: () => {
        navigate('/providers');
        setOpen(false);
      },
      keywords: ['providers', 'agencies', 'contractors', 'network']
    },
    {
      id: 'nav-compliance',
      label: 'Compliance',
      description: 'Workforce compliance tracking',
      icon: Shield,
      category: 'navigation',
      action: () => {
        navigate('/compliance');
        setOpen(false);
      },
      keywords: ['compliance', 'ahpra', 'certification', 'expiry']
    },
    {
      id: 'nav-timesheets',
      label: 'Timesheets',
      description: 'Manage timesheets and hours',
      icon: Clock,
      category: 'navigation',
      action: () => {
        navigate('/timesheets');
        setOpen(false);
      },
      keywords: ['timesheets', 'hours', 'time', 'billing']
    },
    {
      id: 'nav-reports',
      label: 'Reports',
      description: 'Analytics and insights',
      icon: FileText,
      category: 'navigation',
      action: () => {
        navigate('/reports');
        setOpen(false);
      },
      keywords: ['reports', 'analytics', 'insights', 'data']
    },
    {
      id: 'nav-learning',
      label: 'Learning Hub',
      description: 'Training and resources',
      icon: BookOpen,
      category: 'navigation',
      action: () => {
        navigate('/learning-hub');
        setOpen(false);
      },
      keywords: ['learning', 'training', 'education', 'courses']
    },

    // Action Commands
    {
      id: 'action-unfilled',
      label: 'Show unfilled shifts today',
      description: 'View all unfilled shifts',
      icon: AlertTriangle,
      category: 'action',
      action: () => {
        navigate('/shift-allocation');
        setOpen(false);
      },
      keywords: ['unfilled', 'vacant', 'open', 'empty', 'today']
    },
    {
      id: 'action-expiring',
      label: 'View expiring compliance',
      description: 'Staff with expiring certifications',
      icon: AlertTriangle,
      category: 'action',
      action: () => {
        navigate('/compliance');
        setOpen(false);
      },
      keywords: ['expiring', 'compliance', 'ahpra', 'certification']
    },
    
    // Search Commands
    {
      id: 'search-icu',
      label: 'Find available ICU nurses',
      description: 'Search for ICU qualified staff',
      icon: Search,
      category: 'search',
      action: () => {
        navigate('/staff-management');
        setOpen(false);
      },
      keywords: ['icu', 'critical', 'intensive', 'nurses', 'available']
    },
    {
      id: 'search-rn',
      label: 'Find available RN staff',
      description: 'Search for Registered Nurses',
      icon: Search,
      category: 'search',
      action: () => {
        navigate('/staff-management');
        setOpen(false);
      },
      keywords: ['rn', 'registered', 'nurse', 'available']
    },
    {
      id: 'search-sophie',
      label: 'Find Sophie Palmer',
      description: 'View Sophie Palmer profile',
      icon: User,
      category: 'search',
      action: () => {
        navigate('/staff-management');
        setOpen(false);
      },
      keywords: ['sophie', 'palmer', 'staff', 'nurse']
    },
  ];

  const filteredCommands = commands.filter((command) => {
    const searchLower = search.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });

  const groupedCommands = {
    navigation: filteredCommands.filter(c => c.category === 'navigation'),
    action: filteredCommands.filter(c => c.category === 'action'),
    search: filteredCommands.filter(c => c.category === 'search'),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-2 border-indigo-500/20 shadow-2xl">
        {/* Enhanced Header with AI Branding */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4">
          <DialogTitle className="sr-only">AI Command Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search and execute commands using AI-powered search
          </DialogDescription>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">NurseForce AI Search</h3>
              <p className="text-indigo-100 text-xs">Ask anything about staff, shifts, or compliance</p>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>

        {/* Search Input */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center px-5 py-4">
            <Search className="h-5 w-5 text-indigo-500 mr-3" />
            <Input
              placeholder="Ask NurseForce AI... e.g., 'Find ICU nurses tonight' or 'Show unfilled shifts'"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none text-base placeholder:text-gray-400"
              autoFocus
            />
            <div className="flex items-center gap-2 ml-3">
              <Badge variant="outline" className="text-xs bg-gray-50 border-gray-300">
                ⌘K
              </Badge>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[500px] overflow-y-auto p-3 bg-gray-50">
          {search === '' && (
            <div className="p-4 bg-white rounded-lg border border-gray-200 mb-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Try these AI-powered searches:</p>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-600">• "Find available ICU nurses tonight"</p>
                    <p className="text-sm text-gray-600">• "Show unfilled ED shifts this week"</p>
                    <p className="text-sm text-gray-600">• "View compliance expiring soon"</p>
                    <p className="text-sm text-gray-600">• "Find Sophie Palmer profile"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredCommands.length === 0 && search !== '' && (
            <div className="px-4 py-12 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
              <p className="text-sm text-gray-500">Try different keywords or browse categories below</p>
            </div>
          )}

          {/* Navigation Commands */}
          {groupedCommands.navigation.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-3 w-3" />
                  Navigation
                </p>
              </div>
              <div className="space-y-1">
                {groupedCommands.navigation.map((command) => (
                  <button
                    key={command.id}
                    onClick={command.action}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left bg-white hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-200 hover:shadow-sm group"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex items-center justify-center group-hover:from-indigo-100 group-hover:to-blue-100 transition-all">
                      <command.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{command.label}</p>
                      {command.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{command.description}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Commands */}
          {groupedCommands.action.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Quick Actions
                </p>
              </div>
              <div className="space-y-1">
                {groupedCommands.action.map((command) => (
                  <button
                    key={command.id}
                    onClick={command.action}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left bg-white hover:bg-orange-50 rounded-lg transition-all border border-transparent hover:border-orange-200 hover:shadow-sm group"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg flex items-center justify-center group-hover:from-orange-100 group-hover:to-amber-100 transition-all">
                      <command.icon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{command.label}</p>
                      {command.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{command.description}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Commands */}
          {groupedCommands.search.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Search className="h-3 w-3" />
                  Search Results
                </p>
              </div>
              <div className="space-y-1">
                {groupedCommands.search.map((command) => (
                  <button
                    key={command.id}
                    onClick={command.action}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left bg-white hover:bg-purple-50 rounded-lg transition-all border border-transparent hover:border-purple-200 hover:shadow-sm group"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center group-hover:from-purple-100 group-hover:to-pink-100 transition-all">
                      <command.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{command.label}</p>
                      {command.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{command.description}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-gray-200 px-5 py-3 bg-gradient-to-r from-gray-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">↑</kbd>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Esc</kbd>
                Close
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-indigo-600">
              <Sparkles className="h-3 w-3" />
              <span className="font-medium">AI Powered</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}