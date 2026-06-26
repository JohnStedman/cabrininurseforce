import { X, Star, CheckCircle, DollarSign, Clock, Award, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface StaffCandidate {
  staffId: string;
  staffName: string;
  staffType: 'Internal' | 'Pool' | 'Bank' | 'Agency';
  agencyName?: string;
  matchScore: number;
  availability: string;
  hourlyRate?: number;
  hoursThisMonth?: number;
  shiftsCompleted?: number;
  skills: string[];
  compliance: string;
  distance?: string;
  isBestMatch?: boolean;
  isBestValue?: boolean;
  isLowestCost?: boolean;
}

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  match: any; // The match object from smartAllocationMatches
}

export function CompareDrawer({ isOpen, onClose, match }: CompareDrawerProps) {
  if (!isOpen || !match) return null;

  const photoUrls = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=400'
  ];

  // Calculate insights - Include Pool, Bank, and Agency staff
  const supplementalStaff = match.recommendedStaff.filter((s: any) => 
    s.staffType === 'Pool' || s.staffType === 'Bank' || s.agencyName
  );
  
  // Calculate rates and add to staff
  const staffWithRates = supplementalStaff.map((staff: any) => ({
    ...staff,
    hourlyRate: staff.agencyName ? 72 : staff.staffType === 'Bank' ? 65 : 58,
    isBestMatch: staff.matchScore === Math.max(...supplementalStaff.map((s: any) => s.matchScore)),
    isLowestCost: staff.staffType === 'Pool' && !staff.agencyName,
    isBestValue: (staff.staffType === 'Pool' || staff.staffType === 'Bank') && !staff.agencyName && staff.matchScore >= 85
  }));

  const handleAssign = (staffId: string) => {
    const staff = staffWithRates.find((s: any) => s.staffId === staffId);
    onClose();
  };

  // Staff type badge helper
  const getStaffTypeBadge = (staffType: 'Internal' | 'Pool' | 'Bank' | 'Agency', agencyName?: string) => {
    if (staffType === 'Internal') {
      return (
        <Badge className="bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF] font-medium text-xs">
          Internal Ward
        </Badge>
      );
    } else if (staffType === 'Pool') {
      return (
        <Badge className="bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD] font-medium text-xs">
          Permanent Pool
        </Badge>
      );
    } else if (agencyName) {
      return (
        <Badge className="bg-[#FFF6ED] text-[#C4320A] border-[#FDEAD7] font-medium text-xs">
          Agency
        </Badge>
      );
    } else if (staffType === 'Bank') {
      return (
        <Badge className="bg-[#F4F3FF] text-[#5925DC] border-[#E9D7FE] font-medium text-xs">
          Casual Bank
        </Badge>
      );
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Compare Candidates</h2>
              <Badge className="bg-purple-100 text-purple-700">
                {staffWithRates.length} Options
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Shift Context */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-1">{match.facility}</h3>
            <p className="text-sm text-gray-600">
              {match.shiftTime} • {match.department} - {match.role}
            </p>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="p-6 space-y-4">
          {staffWithRates.map((candidate, index) => (
            <div
              key={candidate.staffId}
              className={`border rounded-lg p-5 transition-all ${
                candidate.isBestMatch ? 'border-green-500 bg-green-50/50 shadow-md' :
                candidate.isBestValue ? 'border-purple-500 bg-purple-50/50 shadow-md' :
                'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <ImageWithFallback
                    src={photoUrls[index % photoUrls.length]}
                    alt={candidate.staffName}
                    className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  {(candidate.isBestMatch || candidate.isBestValue) && (
                    <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Star className="h-3 w-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{candidate.staffName}</h3>
                    {getStaffTypeBadge(candidate.staffType, candidate.agencyName)}
                  </div>
                  {candidate.agencyName && (
                    <p className="text-xs text-gray-600">Agency: {candidate.agencyName}</p>
                  )}
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {candidate.isBestMatch && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Best Match
                      </Badge>
                    )}
                    {candidate.isBestValue && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Best Value
                      </Badge>
                    )}
                    {candidate.isLowestCost && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Lowest Cost
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Comparison Grid */}
              <div className="space-y-3">
                {/* Match Score */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Match Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${candidate.matchScore}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-green-600">{candidate.matchScore}%</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Availability</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">{candidate.availability}</span>
                  </div>
                </div>

                {/* Cost */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  <span className={`text-lg font-bold ${
                    candidate.hourlyRate && candidate.isLowestCost ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {candidate.hourlyRate ? `$${candidate.hourlyRate}/hr` : '—'}
                  </span>
                </div>

                {/* Performance */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Performance</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {candidate.hoursThisMonth || 0} hrs • {candidate.shiftsCompleted || 0} shifts
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills && candidate.skills.length > 0 ? (
                      candidate.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No skills listed</span>
                    )}
                  </div>
                </div>

                {/* Compliance */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Compliance</span>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {candidate.compliance}
                  </Badge>
                </div>
              </div>

              {/* Assign Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button 
                  onClick={() => handleAssign(candidate.staffId)}
                  className={`w-full ${
                    candidate.isBestMatch || candidate.isBestValue
                      ? 'bg-[#005DAA] hover:bg-[#004B8F]'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  Assign {candidate.staffName.split(' ')[0]}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="border-t border-gray-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">AI Insights</h3>
          </div>
          
          <div className="space-y-2">
            {match.recommendedStaff.find((s: any) => s.staffType === 'Pool') && (
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-semibold">{match.recommendedStaff.find((s: any) => s.staffType === 'Pool').staffName}</span> (Permanent Pool) has highest match at {match.recommendedStaff.find((s: any) => s.staffType === 'Pool').matchScore}%
                </p>
              </div>
            )}
            
            {staffWithRates.find((s: any) => s.isLowestCost) && (
              <div className="flex items-start gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-semibold">{staffWithRates.find((s: any) => s.isLowestCost).staffName}</span> offers lowest cost (Permanent Pool at standard rate)
                </p>
              </div>
            )}
            
            {staffWithRates.some((a: any) => a.agencyName && a.hourlyRate && staffWithRates.find((s: any) => s.isLowestCost) && a.hourlyRate > staffWithRates.find((s: any) => s.isLowestCost).hourlyRate) && (
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Agency costs ${staffWithRates.find((a: any) => a.agencyName && a.hourlyRate && staffWithRates.find((s: any) => s.isLowestCost) && a.hourlyRate > staffWithRates.find((s: any) => s.isLowestCost).hourlyRate).hourlyRate! - staffWithRates.find((s: any) => s.isLowestCost).hourlyRate!}/hr more than pool staff
                </p>
              </div>
            )}
            
            {match.recommendedStaff.find((s: any) => s.staffType === 'Pool') && match.recommendedStaff.find((s: any) => s.staffType === 'Pool').matchScore >= 90 && (
              <div className="flex items-start gap-2 text-sm">
                <Award className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Recommend <span className="font-semibold">{match.recommendedStaff.find((s: any) => s.staffType === 'Pool').staffName}</span> for best value (high match + standard rate)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => staffWithRates.find((s: any) => s.isBestMatch) && handleAssign(staffWithRates.find((s: any) => s.isBestMatch).staffId)}
              className="flex-1 bg-[#005DAA] hover:bg-[#004B8F]"
            >
              Assign Best Match
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}