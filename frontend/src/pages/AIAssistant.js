import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Leaf, Lightbulb, AlertCircle } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Service
const api = {
  async sendMessage(message, conversationId = null) {
    const requestBody = {
      message: message
    };
    
    if (conversationId) {
      requestBody.conversation_id = conversationId;
    }

    console.log('Sending request to:', `${API_BASE_URL}/chatbot/chat`);
    console.log('Request body:', requestBody);

    // ✅ Build headers properly
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.error || error.message || error.msg || errorMessage;
          console.error('Parsed error:', error);
        } catch (e) {
          console.error('Could not parse error response:', responseText);
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = JSON.parse(responseText);
      console.log('Backend response:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  async getConversations(page = 1, perPage = 10) {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/chatbot/conversations?page=${page}&per_page=${perPage}`,
      { headers }
    );
    
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  },

  async getConversationDetail(conversationId) {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/chatbot/conversations/${conversationId}`,
      { headers }
    );
    
    if (!response.ok) throw new Error('Failed to fetch conversation');
    return response.json();
  },

  async generateRecommendations(conversationId = null) {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/chatbot/recommendations`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ conversation_id: conversationId })
    });
    
    if (!response.ok) throw new Error('Failed to generate recommendations');
    return response.json();
  }
};

const suggestedPrompts = [
  { icon: Leaf, text: 'How can I reduce my carbon footprint?', color: 'bg-green-50 text-green-700 border-green-200' },
  { icon: Lightbulb, text: 'Tips for sustainable living', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { icon: Sparkles, text: 'Show me eco-friendly alternatives nearby', color: 'bg-purple-50 text-purple-700 border-purple-200' }
];

function ChatMessage({ message, isLatest }) {
  const isBot = message.role === 'assistant';
  
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} ${isLatest ? 'animate-fadeIn' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isBot ? 'bg-emerald-100' : 'bg-blue-100'
      }`}>
        {isBot ? (
          <Bot className="text-emerald-600" size={20} />
        ) : (
          <User className="text-blue-600" size={20} />
        )}
      </div>

      <div className={`flex flex-col max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
          isBot 
            ? 'bg-white border border-gray-200 text-gray-800' 
            : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
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

function ErrorMessage({ error, onDismiss }) {
  return (
    <div className="max-w-4xl mx-auto mb-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <p className="text-sm text-red-800 font-medium">Error</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
        <button 
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Load initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your personal Ecobot assistant. I can help you reduce your carbon footprint. Would you like tips or information about reducing carbon footprint?",
      timestamp: new Date().toISOString()
    };
    setChatMessages([welcomeMessage]);
    setIsLoading(false);
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await api.sendMessage(chatInput, currentConversationId);
      
      if (response.success && response.data) {
        // Update conversation ID if new conversation was created
        if (response.data.conversation_id && !currentConversationId) {
          setCurrentConversationId(response.data.conversation_id);
        }

        // Add assistant's response
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.data.response || response.data.message,
          timestamp: new Date().toISOString()
        };

        setIsTyping(false);
        setChatMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      setIsTyping(false);
      setError(err.message || 'Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    }
  };

  const handlePromptClick = (promptText) => {
    setChatInput(promptText);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 top-16 flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <Bot className="text-white animate-pulse" size={32} />
          </div>
          <p className="text-gray-600">Loading AI Assistant...</p>
        </div>
      </div>
    );
  }
return (
  <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 to-white">
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
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Error Message */}
        {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

        {/* Welcome message with suggestions (only show when minimal messages) */}
        {chatMessages.length <= 1 && (
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

    {/* Chat Input - Sticky at Bottom */}
    <div className="bg-white border-t shadow-lg flex-shrink-0 sticky bottom-0">
      <div className="max-w-4xl mx-auto p-4">
        {/* Quick Actions */}
        {chatMessages.length > 1 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
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
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Sparkles size={18} />
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isTyping}
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

    <style>{`
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
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  </div>
);
}