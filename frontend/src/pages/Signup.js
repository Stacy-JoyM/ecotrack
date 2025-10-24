import React, { useState } from "react";
import { registerUser } from "../services/api";
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this import

const Signup = ({onNavigateToLogin}) => {
  const navigate = useNavigate(); // ✅ Add this hook
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword:""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  const handleChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate passwords match
  if (signupForm.password !== signupForm.confirmPassword) {
    setMessage('Passwords do not match!');
    return;
  }
  
  // Validate all fields
  if (!signupForm.username || !signupForm.email || !signupForm.password) {
    setMessage('Please fill in all fields!');
    return;
  }

  try {
    setLoading(true);
    const data = await registerUser(signupForm);
    
    console.log("Registration response:", data); // ✅ DEBUG - Check what you receive
    
    // Check if registration was successful
    if (data.success && data.token) {
      setMessage(data.message || "Registration complete!");
      
      // Store token and user
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // To this:
     setTimeout(() => {
        navigate('/dashboard'); // ✅ React Router way
     }, 500);
    } else {
      // Show error message from backend
      setMessage(data.message || "Registration failed!");
    }
  } catch (error) {
    console.error("Registration error:", error);
    setMessage("Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="text-emerald-600" size={40} />
          <h1 className="text-3xl font-bold text-gray-800">Ecotrack</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Create Account</h2>
        
        {/* ✅ Display message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('failed') || message.includes('error')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
          }`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="John Doe"
              value={signupForm.username}
              onChange={handleChange}
              required
              disabled={loading} // ✅ Disable during loading
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="your@email.com"
              value={signupForm.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="••••••••"
              value={signupForm.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="••••••••"
              value={signupForm.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-emerald-400 disabled:cursor-not-allowed"
            disabled={loading} // ✅ Disable button during loading
          >
            {loading ? 'Signing up...' : 'Sign Up'} {/* ✅ Show loading text */}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={onNavigateToLogin}
            className="text-emerald-600 font-semibold hover:underline"
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;