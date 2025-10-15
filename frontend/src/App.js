import React, { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import TrackActivity from './pages/TrackActivity';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import MainLayout from './components/MainLayout';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    // Pre-existing demo user
    { email: 'johndoe@gmail.com', password: '1234', name: 'John Doe' }
  ]);

  // Handle Login
  const handleLogin = (loginData) => {
    const foundUser = registeredUsers.find(
      u => u.email === loginData.email && u.password === loginData.password
    );

    if (foundUser) {
      setUser({ name: foundUser.name, email: foundUser.email });
      setCurrentPage('dashboard');
    } else {
      alert('Invalid email or password. Please try again or sign up.');
    }
  };

  // Handle Signup
  const handleSignup = (signupData) => {
    // Check if user already exists
    const userExists = registeredUsers.find(u => u.email === signupData.email);
    
    if (userExists) {
      alert('An account with this email already exists. Please login.');
      return;
    }

    // Add new user to registered users
    const newUser = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password
    };
    
    setRegisteredUsers([...registeredUsers, newUser]);
    setUser({ name: newUser.name, email: newUser.email });
    setCurrentPage('dashboard'); // Go directly to dashboard
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  // Auth pages (no MainLayout)
  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onNavigateToSignup={() => setCurrentPage('signup')} />;
  }

  if (currentPage === 'signup') {
    return <Signup onSignup={handleSignup} onNavigateToLogin={() => setCurrentPage('login')} />;
  }

  // Protected pages (with MainLayout)
  return (
    <MainLayout activePage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} user={user}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'assistant' && <AIAssistant />}
      {currentPage === 'track' && <TrackActivity />}
      {currentPage === 'discover' && <Discover />}
      {currentPage === 'profile' && <Profile user={user} />}
    </MainLayout>
  );
}