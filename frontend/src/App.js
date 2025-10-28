import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import TrackActivity from './pages/TrackActivity';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import MainLayout from './components/MainLayout';
import { registerUser, loginUser, getProfile } from './services/api'; // Import API functions

// ProtectedRoute Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// AppContent - uses router hooks
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getProfile(token);
          if (response.success) {
            setUser(response.user);
          } else {
            // Invalid token, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Get active page from URL
  const getActivePage = () => {
    const path = location.pathname.substring(1) || 'dashboard';
    return path;
  };

  // Handle Login
  const handleLogin = async (loginData) => {
    try {
      const response = await loginUser(loginData);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        navigate('/dashboard');
      } else {
        alert(response.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  // Handle Signup
  const handleSignup = async (signupData) => {
    try {
      const response = await registerUser(signupData);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        navigate('/dashboard');
      } else {
        alert(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Handle Navigation
  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={<Login onLogin={handleLogin} onNavigateToSignup={() => navigate('/signup')} />} 
      />
      <Route 
        path="/signup" 
        element={<Signup onSignup={handleSignup} onNavigateToLogin={() => navigate('/login')} />} 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout 
              activePage={getActivePage()} 
              onNavigate={handleNavigate} 
              onLogout={handleLogout} 
              user={user}
            >
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <MainLayout 
              activePage={getActivePage()} 
              onNavigate={handleNavigate} 
              onLogout={handleLogout} 
              user={user}
            >
              <AIAssistant />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/track"
        element={
          <ProtectedRoute>
            <MainLayout 
              activePage={getActivePage()} 
              onNavigate={handleNavigate} 
              onLogout={handleLogout} 
              user={user}
            >
              <TrackActivity />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <MainLayout 
              activePage={getActivePage()} 
              onNavigate={handleNavigate} 
              onLogout={handleLogout} 
              user={user}
            >
              <Discover />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout 
              activePage={getActivePage()} 
              onNavigate={handleNavigate} 
              onLogout={handleLogout} 
              user={user}
            >
              <Profile user={user} />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Main App Component with BrowserRouter
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}