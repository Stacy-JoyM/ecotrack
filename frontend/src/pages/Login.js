import React, { useState } from "react";
import {loginUser} from "../services/api";
import {Leaf} from 'lucide-react';

const Login = ({onNavigateToSignup}) => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = await loginUser(loginForm);
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard"; // redirect after login
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="text-emerald-600" size={40} />
          <h1 className="text-3xl font-bold text-gray-800">Ecotrack</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Welcome Back</h2>
        
        {error && (  // ✅ Display error message
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"  // ✅ Added name attribute
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="your@email.com"
              value={loginForm.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"  // ✅ Added name attribute
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="••••••••"
              value={loginForm.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="button" className="text-sm text-emerald-600 hover:underline">
            Forgot password?
          </button>
          
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={onNavigateToSignup}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
