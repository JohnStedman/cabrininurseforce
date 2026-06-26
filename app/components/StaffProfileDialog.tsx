import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Star, 
  MapPin, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  Phone, 
  Mail, 
  Building2,
  UserCog,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Zap
} from 'lucide-react';

interface StaffProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff: {
    staffId: string;
    staffName: string;
    staffType: 'Internal' | 'Pool' | 'Bank' | 'Agency';
    agencyName?: string;
    matchScore: number;
    availability: string;
    hourlyRate?: number;
    hoursThisMonth?: number;
    shiftsCompleted?: number;
    skills?: string[];
    compliance: string;
    distance?: string;
    clientPreference?: {
      rating: number;
      preferredBy: string[];
    };
    matchReasons?: Array<{ reason: string; score: number }>;
  };
  photoUrl?: string;
  onAssign?: () => void;
}

export function StaffProfileDialog({ 
  isOpen, 
  onClose, 
  staff, 
  photoUrl,
  onAssign 
}: StaffProfileDialogProps) {
  // Get staff type badge
  const getStaffTypeBadge = (staffType: 'Internal' | 'Pool' | 'Bank' | 'Agency', agencyName?: string) => {
    if (staffType === 'Internal') {
      return (
        <Badge className="bg-[#EFF8FF] text-[#175CD3] border-0">
          <Building2 className="h-3 w-3 mr-1" />
          Internal Ward
        </Badge>
      );
    } else if (staffType === 'Pool') {
      return (
        <Badge className="bg-[#E0F2FE] text-[#0369A1] border-0">
          <Building2 className="h-3 w-3 mr-1" />
          Permanent Pool
        </Badge>
      );
    } else if (agencyName) {
      return (
        <Badge className="bg-[#FFF6ED] text-[#C4320A] border-0">
          <UserCog className="h-3 w-3 mr-1" />
          Agency
        </Badge>
      );
    } else if (staffType === 'Bank') {
      return (
        <Badge className="bg-[#F4F3FF] text-[#5925DC] border-0">
          <UserCog className="h-3 w-3 mr-1" />
          Casual Bank
        </Badge>
      );
    }
  };

  // Calculate match grade
  const getMatchGrade = (score: number) => {
    if (score >= 95) return { grade: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 85) return { grade: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 75) return { grade: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { grade: 'Fair', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const matchGrade = getMatchGrade(staff.matchScore);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {/* Profile Photo */}
            {photoUrl && (
              <img 
                src={photoUrl} 
                alt={staff.staffName}
                className="h-20 w-20 rounded-full object-cover flex-shrink-0"
              />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DialogTitle className="text-2xl">{staff.staffName}</DialogTitle>
                {getStaffTypeBadge(staff.staffType, staff.agencyName)}
              </div>
              <DialogDescription className="sr-only">
                Comprehensive staff profile including availability, skills, compliance status, and performance metrics
              </DialogDescription>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{staff.clientPreference?.rating || '4.8'}</span>
                </div>
                {staff.distance && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{staff.distance}</span>
                  </div>
                )}
                <Badge className={`${matchGrade.bg} ${matchGrade.color} border-0`}>
                  Match: {staff.matchScore}% • {matchGrade.grade}
                </Badge>
              </div>

              {/* Organization info */}
              {staff.agencyName && (
                <p className="text-sm text-gray-600 mt-2">
                  <Building2 className="h-3 w-3 inline mr-1" />
                  {staff.agencyName}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="match">Match Details</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Availability Status */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Availability Status</h3>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  {staff.availability}
                </Badge>
              </div>
              <p className="text-sm text-gray-700">
                Available for immediate assignment • No scheduling conflicts
              </p>
            </div>

            {/* Employment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Employment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Type</p>
                  <p className="font-medium text-gray-900">{staff.staffType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Organization</p>
                  <p className="font-medium text-gray-900">
                    {staff.agencyName || 'Cabrini Malvern'}
                  </p>
                </div>
                {staff.hourlyRate && (
                  <>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Hourly Rate</p>
                      <p className="text-lg font-bold text-[#005DAA]">${staff.hourlyRate}/hr</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Est. Shift Cost (8hrs)</p>
                      <p className="font-medium text-gray-900">${staff.hourlyRate * 8}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Skills & Competencies */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Skills & Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {staff.skills?.map((skill) => (
                  <Badge key={skill} className="bg-blue-100 text-blue-700 border-0">
                    {skill}
                  </Badge>
                )) || <p className="text-sm text-gray-500">No skills listed</p>}
              </div>
            </div>

            {/* Compliance Status */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Compliance Status</h3>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  {staff.compliance}
                </Badge>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">AHPRA Registration</span>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Valid
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Police Check</span>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Valid
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Work Rights</span>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>+61 4XX XXX XXX</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{staff.staffName.toLowerCase().replace(' ', '.')}@example.com</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Match Details Tab */}
          <TabsContent value="match" className="space-y-4 mt-4">
            {/* Match Score Breakdown */}
            <div className={`${matchGrade.bg} p-4 rounded-lg border border-${matchGrade.color.replace('text-', '')}/20`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Overall Match Score</h3>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${matchGrade.color}`}>{staff.matchScore}%</p>
                  <p className={`text-sm ${matchGrade.color}`}>{matchGrade.grade}</p>
                </div>
              </div>
            </div>

            {/* Match Reasons */}
            {staff.matchReasons && staff.matchReasons.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Why This Match Works</h3>
                <div className="space-y-2">
                  {staff.matchReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{reason.reason}</p>
                        {reason.score > 0 && (
                          <div className="mt-2">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${reason.score}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facility Preference */}
            {staff.clientPreference && staff.clientPreference.preferredBy && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Client Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-700">
                      Rated <strong>{staff.clientPreference.rating}/5.0</strong> by facilities
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-700">
                      Preferred by <strong>{staff.clientPreference.preferredBy.length}</strong> departments
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Distance & Location */}
            {staff.distance && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Location</h3>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>{staff.distance}</strong> from {localStorage.getItem('cabriniLocation') || 'Cabrini Malvern'} • Short commute time
                </p>
              </div>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Hours</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {staff.hoursThisMonth || 156}
                </p>
                <p className="text-xs text-blue-600 mt-1">This month</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Shifts</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {staff.shiftsCompleted || 24}
                </p>
                <p className="text-xs text-green-600 mt-1">Completed</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Rating</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {staff.clientPreference?.rating || '4.8'}/5.0
                </p>
                <p className="text-xs text-purple-600 mt-1">Client rating</p>
              </div>
            </div>

            {/* Cost Analysis (if applicable) */}
            {staff.hourlyRate && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Cost Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Hourly Rate</p>
                    <p className="text-xl font-bold text-[#005DAA]">${staff.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Monthly Cost</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${staff.hourlyRate * (staff.hoursThisMonth || 156)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Average Shift (8hrs)</p>
                    <p className="text-lg font-semibold text-gray-900">${staff.hourlyRate * 8}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Night Shift (8hrs + 20%)</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${Math.round(staff.hourlyRate * 8 * 1.2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reliability Metrics */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Reliability</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Shift Completion Rate</span>
                    <span className="font-semibold text-gray-900">98%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">On-Time Arrival</span>
                    <span className="font-semibold text-gray-900">96%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Client Satisfaction</span>
                    <span className="font-semibold text-gray-900">94%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">Last shift: <strong>Yesterday</strong> at Cabrini Malvern</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">Worked <strong>24 shifts</strong> in the last 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">Performance trending <strong className="text-green-600">upward</strong></span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t">
          {onAssign && (
            <Button 
              className="bg-[#005DAA] hover:bg-[#004B8F] flex-1"
              onClick={() => {
                onAssign();
                onClose();
              }}
            >
              <Zap className="h-4 w-4 mr-2" />
              Assign to Shift
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}