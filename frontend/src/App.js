import React, { useState } from 'react';
import AIAssistant from './pages/AIAssistant';
import TrackActivity from './pages/TrackActivity';
import MainLayout from './components/MainLayout';

// Main App Component
export default function App() {
  const [activePage, setActivePage] = useState('assistant');

  return (
    <MainLayout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'assistant' && <AIAssistant />}
      {activePage === 'track' && <TrackActivity />}
    </MainLayout>
  );
}
