import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, User, CheckCheck, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
  read?: boolean;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Torrens Health support. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      agentName: 'Sarah Mitchell'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'agent' && !lastMessage.read) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      read: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate agent typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(inputValue),
        sender: 'agent',
        timestamp: new Date(),
        agentName: 'Sarah Mitchell'
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1500 + Math.random() * 1500);
  };

  const getAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('shift') || lowerMessage.includes('roster')) {
      return 'I can help you with shift management. Would you like assistance with viewing shifts, creating new shifts, or managing shift allocations?';
    } else if (lowerMessage.includes('staff') || lowerMessage.includes('nurse')) {
      return 'For staff-related queries, I can assist with staff profiles, compliance, AHPRA registration, or availability. What specific information do you need?';
    } else if (lowerMessage.includes('timesheet') || lowerMessage.includes('payment')) {
      return 'I can help with timesheet queries including submissions, approvals, and payment tracking. What would you like to know?';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return 'I\'m here to help! Common topics include shift management, staff coordination, compliance tracking, and system navigation. What can I assist you with?';
    } else if (lowerMessage.includes('demo') || lowerMessage.includes('training')) {
      return 'Would you like to schedule a personalised demo or training session? I can connect you with our team to arrange a time that suits you.';
    } else {
      return 'Thank you for your message. Let me help you with that. Can you provide a bit more detail about what you need assistance with?';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-[#2b7fee] to-[#1d6adb] hover:from-[#1d6adb] hover:to-[#0f5ec9] shadow-2xl shadow-[#2b7fee]/30 relative group transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-7 w-7 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
              {unreadCount}
            </span>
          )}
          <span className="absolute -top-1 -left-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></span>
          <span className="absolute right-20 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Live Chat
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ${
        isMinimized ? 'w-80' : 'w-96 h-[600px]'
      } flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2b7fee] to-[#1d6adb] text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-lg relative">
              <span className="text-[#2b7fee] font-bold text-base">YNA</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h3 className="font-semibold text-base">Customer Support</h3>
              <div className="flex items-center gap-1.5 text-xs text-white/90">
                <Sparkles className="h-3 w-3" />
                <span>Always here to help</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 relative z-10">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-9 w-9 p-0 text-white hover:bg-white/20 rounded-full transition-all inline-flex items-center justify-center"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 p-0 text-white hover:bg-white/20 rounded-full transition-all inline-flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-2">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#2b7fee] to-[#1d6adb] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Torrens Health Support</p>
                    <p className="text-xs text-gray-600">We're here 24/7 to assist with all your NurseForce queries.</p>
                  </div>
                </div>
              </div>

              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {message.sender === 'agent' && (
                      <div className="h-9 w-9 bg-gradient-to-br from-[#2b7fee] to-[#1d6adb] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      {message.sender === 'agent' && message.agentName && (
                        <p className="text-xs font-medium text-gray-700 px-1">{message.agentName}</p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-[#2b7fee] to-[#1d6adb] text-white rounded-tr-sm'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <p className="text-xs text-gray-500">{formatTime(message.timestamp)}</p>
                        {message.sender === 'user' && (
                          <CheckCheck className="h-3 w-3 text-[#2b7fee]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="h-9 w-9 bg-gradient-to-br from-[#2b7fee] to-[#1d6adb] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-gray-700 px-1">Sarah Mitchell</p>
                      <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                        <div className="flex gap-1.5">
                          <div className="h-2 w-2 bg-[#2b7fee] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="h-2 w-2 bg-[#2b7fee] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="h-2 w-2 bg-[#2b7fee] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b7fee] focus:border-transparent text-sm transition-all shadow-sm hover:border-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-br from-[#2b7fee] to-[#1d6adb] hover:from-[#1d6adb] hover:to-[#0f5ec9] disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12 rounded-xl shadow-md transition-all hover:shadow-lg inline-flex items-center justify-center text-white"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Typically replies within minutes • Available 24/7</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}