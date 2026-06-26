import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Sparkles,
  Send,
  X,
  ChevronRight,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Star
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  staffRecommendations?: Array<{
    name: string;
    role: string;
    matchScore: number;
    available: boolean;
    distance?: string;
    reliability?: number;
    highlights: string[];
  }>;
}

export function AIAssistantPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hello! I'm NurseForce AI. I can help you with staffing decisions, shift coverage, and workforce insights. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Who can cover ICU tonight?",
        "Show unfilled shifts today",
        "Find RN staff near Cabrini Malvern"
      ]
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response based on input
    setTimeout(() => {
      let assistantMessage: Message;

      if (input.toLowerCase().includes('icu') || input.toLowerCase().includes('cover')) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I found 3 highly qualified ICU nurses available tonight:",
          timestamp: new Date(),
          staffRecommendations: [
            {
              name: 'Sophie Palmer',
              role: 'RN',
              matchScore: 98,
              available: true,
              distance: '3.2 km',
              reliability: 4.8,
              highlights: ['ICU Experience', 'Available Tonight', '4.8 Reliability Score']
            },
            {
              name: 'Sarah Mitchell',
              role: 'RN',
              matchScore: 95,
              available: true,
              distance: '5.1 km',
              reliability: 4.9,
              highlights: ['ICU Specialist', 'Triage Certified', 'Available']
            },
            {
              name: 'James Chen',
              role: 'RN',
              matchScore: 92,
              available: true,
              distance: '2.8 km',
              reliability: 4.7,
              highlights: ['Critical Care', 'Emergency Experience']
            }
          ]
        };
      } else if (input.toLowerCase().includes('unfilled')) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "⚠️ You have 4 unfilled shifts today:\n\n• Emergency Department - 07:00-19:00 (HIGH PRIORITY)\n• Surgical Ward 3A - 11:00-19:30 (HIGH PRIORITY)\n• Emergency Department - 19:00-07:00 (HIGH PRIORITY)\n• Aged Care Unit - 12:30-20:30 (MEDIUM)\n\nWould you like me to recommend staff for these shifts?",
          timestamp: new Date(),
          suggestions: [
            "Find staff for Emergency Department",
            "Auto-fill all unfilled shifts",
            "Show high priority shifts only"
          ]
        };
      } else if (input.toLowerCase().includes('rn') || input.toLowerCase().includes('nurse')) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I found 6 Registered Nurses available near Cabrini Malvern:",
          timestamp: new Date(),
          staffRecommendations: [
            {
              name: 'Sophie Palmer',
              role: 'RN',
              matchScore: 96,
              available: true,
              distance: '3.2 km',
              reliability: 4.8,
              highlights: ['Emergency', 'Trauma', 'Triage']
            },
            {
              name: 'Sarah Mitchell',
              role: 'RN',
              matchScore: 94,
              available: true,
              distance: '5.1 km',
              reliability: 4.9,
              highlights: ['ICU', 'Emergency', 'Triage']
            }
          ],
          suggestions: [
            "Filter by ICU experience",
            "Show only 5km radius",
            "Sort by reliability score"
          ]
        };
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I can help you with:\n\n✅ Finding available staff\n✅ Shift coverage recommendations\n✅ Compliance alerts\n✅ Performance insights\n\nTry asking: 'Who can cover ICU tonight?' or 'Show unfilled shifts today'",
          timestamp: new Date(),
          suggestions: [
            "Who can cover ICU tonight?",
            "Show unfilled shifts today",
            "Find RN staff near Cabrini Malvern"
          ]
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
    }, 800);

    setInput('');
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  // AI Assistant Panel removed - now using Quick Actions button
  return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">NurseForce AI</h3>
            <p className="text-xs text-white/80">Workforce Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>

              {/* Staff Recommendations */}
              {message.staffRecommendations && (
                <div className="mt-3 space-y-2">
                  {message.staffRecommendations.map((staff, idx) => (
                    <Card key={idx} className="p-3 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{staff.name}</p>
                          <p className="text-xs text-gray-600">{staff.role}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {staff.matchScore}% Match
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                        {staff.distance && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {staff.distance}
                          </span>
                        )}
                        {staff.reliability && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {staff.reliability}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        {staff.highlights.map((highlight, hidx) => (
                          <div key={hidx} className="flex items-center gap-1 text-xs text-gray-700">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            {highlight}
                          </div>
                        ))}
                      </div>

                      <Button size="sm" className="w-full mt-2 bg-[#005DAA] hover:bg-[#004B8F]">
                        Book {staff.name.split(' ')[0]}
                      </Button>
                    </Card>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {message.suggestions && (
                <div className="mt-3 space-y-1.5">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestion(suggestion)}
                      className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <span className="text-gray-700">{suggestion}</span>
                      <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about staffing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to send
        </p>
      </div>
    </div>
  );
}