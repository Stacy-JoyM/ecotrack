import React from 'react';
import { MessageSquare, BarChart3} from 'lucide-react';


// Sidebar Component
const Sidebar = ({ activePage, onNavigate }) => {
  return (
    <div className="w-64 bg-emerald-600 text-white h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-700 rounded flex items-center justify-center text-xl">
            🌱
          </div>
          <span className="text-xl font-bold">Ecotrack</span>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => onNavigate('assistant')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activePage === 'assistant' ? 'bg-emerald-700' : 'hover:bg-emerald-700'
            }`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">AI Assistant</span>
          </button>
          
          <button
            onClick={() => onNavigate('track')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activePage === 'track' ? 'bg-emerald-700' : 'hover:bg-emerald-700'
            }`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Track Activity</span>
          </button>
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-emerald-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          <div>
            <div className="font-medium">John Doe</div>
            <button className="text-sm text-emerald-200 hover:text-white">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Sidebar;