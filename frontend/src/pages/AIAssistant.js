import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';

// API Configuration - USE ENVIRONMENT VARIABLE
const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/chatbot`
  : 'https://ecotrack-ai-backend.onrender.com/api/chatbot';

console.log('🤖 AI Assistant API URL:', API_URL);

// API service for chatbot
const api = {
  sendMessage: async (message) => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || user?.email || 'guest';

      const endpoint = `${API_URL}/chat`;
      console.log('📡 Sending request to:', endpoint);
      console.log('📝 Request body:', { user_id: userId, message: message });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          message: message
        })
      });

      console.log('📊 Response status:', response.status);
      console.log('✅ Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          console.log('🔍 Parsed error:', errorData);
        } catch (e) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        throw new Error(errorData.error || errorData.message || 'Failed to send message');
      }

      const data = await response.json();
      console.log('✨ Success response:', data);
      return data.response;

    } catch (error) {
      console.error('💥 Fetch error:', error);
      throw error;
    }
  }
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm your EcoTrack AI Assistant, powered by advanced intelligence to help you live more sustainably. Ask me anything about reducing your carbon footprint, eco-friendly tips, or sustainable living practices!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('💬 Sending message:', inputMessage);
      
      const botResponse = await api.sendMessage(inputMessage);
      
      console.log('🤖 Bot response received:', botResponse);

      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed left-0 right-0 flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" 
         style={{ top: '73px', bottom: '0' }}>
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg p-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Bot className="text-emerald-600" size={28} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">EcoTrack AI Assistant</h1>
              <Sparkles className="text-yellow-300" size={20} />
            </div>
            <p className="text-emerald-100 text-sm">Powered by Gemini AI • Always learning, always improving</p>
          </div>
        </div>
      </div>

      {/* Messages Container with Enhanced Styling */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 animate-fadeIn ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
            style={{
              animation: `fadeIn 0.3s ease-in ${index * 0.1}s both`
            }}
          >
            {/* Enhanced Avatar */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                message.sender === 'bot'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  : 'bg-gradient-to-br from-gray-600 to-gray-800'
              }`}
            >
              {message.sender === 'bot' ? (
                <Bot className="text-white" size={20} />
              ) : (
                <UserIcon className="text-white" size={20} />
              )}
            </div>

            {/* Enhanced Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl p-5 shadow-lg transition-all hover:shadow-xl ${
                message.sender === 'bot'
                  ? message.isError
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-white border border-emerald-100'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-opacity-20 border-current">
                <span
                  className={`text-xs ${
                    message.sender === 'bot'
                      ? 'text-gray-500'
                      : 'text-emerald-100'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </span>
                {message.sender === 'bot' && !message.isError && (
                  <span className="text-xs text-emerald-600 font-medium">✓ AI Response</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
              <Bot className="text-white" size={20} />
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-5 border border-emerald-100">
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-emerald-600" size={20} />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="bg-white border-t border-gray-200 p-6 shadow-lg flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about sustainability and eco-friendly living..."
              className="w-full px-6 py-4 pr-12 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
              disabled={isLoading}
            />
            {inputMessage && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-gray-400">{inputMessage.length}</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Send size={24} />
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-3">
          💡 Tip: Try asking about recycling, renewable energy, or sustainable transportation!
        </p>
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
      `}</style>
    </div>
  );
};

export default AIAssistant;
