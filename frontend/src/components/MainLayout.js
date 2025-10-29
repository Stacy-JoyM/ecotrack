import React, { useState } from 'react';
import { Leaf, Activity, Plus, MessageSquare, MapPin, User, LogOut, Menu, X } from 'lucide-react';

export default function MainLayout({ children, activePage, onNavigate, onLogout, user }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white shadow-md">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={28} />
            <span className="text-xl font-bold">Ecotrack</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className={`${showMobileMenu ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row absolute lg:relative top-full lg:top-0 left-0 right-0 bg-emerald-600 lg:bg-transparent gap-2 lg:gap-4 p-4 lg:p-0 shadow-lg lg:shadow-none`}>
            <button 
              onClick={() => { onNavigate('dashboard'); setShowMobileMenu(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${activePage === 'dashboard' ? 'bg-emerald-700' : 'hover:bg-emerald-500'}`}
            >
              <Activity size={18} />
              Dashboard
            </button>
            
            <button 
              onClick={() => { onNavigate('track'); setShowMobileMenu(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${activePage === 'track' ? 'bg-emerald-700' : 'hover:bg-emerald-500'}`}
            >
              <Plus size={18} />
              Track Activity
            </button>
            
            <button 
              onClick={() => { onNavigate('assistant'); setShowMobileMenu(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${activePage === 'assistant' ? 'bg-emerald-700' : 'hover:bg-emerald-500'}`}
            >
              <MessageSquare size={18} />
              AI Assistant
            </button>
            
            <button 
              onClick={() => { onNavigate('discover'); setShowMobileMenu(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${activePage === 'discover' ? 'bg-emerald-700' : 'hover:bg-emerald-500'}`}
            >
              <MapPin size={18} />
              Discover
            </button>
            
            <button 
              onClick={() => { onNavigate('profile'); setShowMobileMenu(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${activePage === 'profile' ? 'bg-emerald-700' : 'hover:bg-emerald-500'}`}
            >
              <User size={18} />
              Profile
            </button>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4 lg:ml-4 border-t lg:border-t-0 lg:border-l border-emerald-500 pt-4 lg:pt-0 lg:pl-4 mt-4 lg:mt-0">
              <span className="text-sm font-medium">{user?.name || user?.username || user?.email?.split('@')[0] || 'User'}</span>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-red-600 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content - Conditional padding based on page */}
      <main className={activePage === 'discover' ? '' : 'pt-20'}>{children}</main>
    </div>
  );
}