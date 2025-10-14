import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Message from '../components/Message';

// AI Assistant Page Component

// AI Assistant Page Component
const AIAssistant= () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi! I'm your personal Ecobot assistant. I can help you reduce your carbon footprint by keeping tracking of your activities. Would you like any tips or information about reducing carbon footprint?",
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), content: input, isBot: false }]);
      setInput('');
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          content: "I'd be happy to help you reduce your carbon footprint! Here are some tips: use public transportation, reduce energy consumption at home, choose sustainable products, and track your daily activities to see where you can improve.",
          isBot: true
        }]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-800">AI Assistant</h1>
        <p className="text-gray-500 text-sm">Your personal sustainability advisor</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.map(message => (
          <Message key={message.id} content={message.content} isBot={message.isBot} />
        ))}
      </div>
      
      <div className="border-t border-gray-200 px-8 py-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about reducing carbon footprint...."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            className="bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default AIAssistant; 