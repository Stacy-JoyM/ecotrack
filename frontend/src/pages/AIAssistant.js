import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Leaf, Lightbulb } from 'lucide-react';

const initialChatMessages = [
  { 
    id: 1, 
    sender: 'bot', 
    text: "Hi! I'm your personal Ecobot assistant. I can help you reduce your carbon footprint. Would you like tips or information about reducing carbon footprint?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const suggestedPrompts = [
  { icon: Leaf, text: 'How can I reduce my carbon footprint?', color: 'bg-green-50 text-green-700 border-green-200' },
  { icon: Lightbulb, text: 'Tips for sustainable living', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { icon: Sparkles, text: 'Show me eco-friendly alternatives nearby', color: 'bg-purple-50 text-purple-700 border-purple-200' }
];

function ChatMessage({ message, isLatest }) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} ${isLatest ? 'animate-fadeIn' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isBot ? 'bg-emerald-100' : 'bg-blue-100'
      }`}>
        {isBot ? (
          <Bot className="text-emerald-600" size={20} />
        ) : (
          <User className="text-blue-600" size={20} />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
          isBot 
            ? 'bg-white border border-gray-200 text-gray-800' 
            : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
        }`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-2">{message.timestamp}</span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100">
        <Bot className="text-emerald-600" size={20} />
      </div>
      <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'user',
        text: chatInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages([...chatMessages, newMessage]);
      setChatInput('');
      setIsTyping(true);

      setTimeout(() => {
        const responses = [
          "That's a great question! Try using public transport instead of driving. It can reduce your carbon footprint by up to 45%. Consider carpooling or biking for shorter distances!",
          'I found some eco-friendly alternatives near you! Check out Green Grocers Market just 0.8km away. They offer locally sourced, organic produce with minimal packaging.',
          'Based on your activities, I recommend reducing meat consumption. Plant-based meals can cut food emissions by 50%. Try starting with "Meatless Mondays"!',
          "Great progress! You've reduced your carbon footprint by 15% this week compared to last week. Keep up the amazing work! 🌱",
          "Here are 3 quick wins: 1) Switch to LED bulbs 2) Unplug devices when not in use 3) Use reusable bags and bottles. Small changes make a big difference!"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setIsTyping(false);
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'bot',
          text: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  const handlePromptClick = (promptText) => {
    setChatInput(promptText);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 top-16 flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm flex-shrink-0">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">AI Assistant</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online - Ready to help
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Welcome message with suggestions (only show when no messages) */}
          {chatMessages.length === 1 && (
            <div className="mb-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles size={16} />
                  Ask me anything about sustainability
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {suggestedPrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt.text)}
                      className={`p-4 rounded-xl border-2 ${prompt.color} hover:shadow-md transition-all text-left group`}
                    >
                      <Icon size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium">{prompt.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          {chatMessages.map((msg, index) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              isLatest={index === chatMessages.length - 1}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <div className="bg-white border-t shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto p-4">
          {/* Quick Actions */}
          {chatMessages.length > 1 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              <button
                onClick={() => handlePromptClick('How can I reduce my carbon footprint?')}
                className="px-4 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition whitespace-nowrap border border-emerald-200"
              >
                💡 Reduce footprint
              </button>
              <button
                onClick={() => handlePromptClick('Show me eco-friendly alternatives nearby')}
                className="px-4 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition whitespace-nowrap border border-emerald-200"
              >
                🌍 Local alternatives
              </button>
              <button
                onClick={() => handlePromptClick('Give me sustainable living tips')}
                className="px-4 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition whitespace-nowrap border border-emerald-200"
              >
                ♻️ Sustainability tips
              </button>
            </div>
          )}

          {/* Input Field */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                placeholder="Ask me anything about reducing carbon footprint..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Sparkles size={18} />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-3 rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition flex-shrink-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send • AI-powered eco-friendly recommendations
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}