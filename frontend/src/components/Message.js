import React from 'react';

// Message Component
const Message = ({ content, isBot }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
        isBot ? 'bg-emerald-100' : 'bg-blue-100'
      }`}>
        {isBot ? '🌱' : '👤'}
      </div>
      <div className={`max-w-2xl px-4 py-3 rounded-lg ${
        isBot ? 'bg-gray-100' : 'bg-blue-500 text-white'
      }`}>
        {content}
      </div>
    </div>
  );
};

export default Message; 