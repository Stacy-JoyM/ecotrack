import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Activity, Leaf, Target, Award } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const carbonData = [
  { date: 'Mon', transport: 2.5, food: 1.8, energy: 3.2, total: 7.5 },
  { date: 'Tue', transport: 3.2, food: 2.1, energy: 2.8, total: 8.1 },
  { date: 'Wed', transport: 1.9, food: 2.3, energy: 3.5, total: 7.7 },
  { date: 'Thu', transport: 2.8, food: 1.5, energy: 2.9, total: 7.2 },
  { date: 'Fri', transport: 2.1, food: 2.0, energy: 3.1, total: 7.2 },
  { date: 'Sat', transport: 0.8, food: 2.5, energy: 4.2, total: 7.5 },
  { date: 'Sun', transport: 0.6, food: 2.2, energy: 3.8, total: 6.6 }
];

const categoryData = [
  { name: 'Transport', value: 35, color: '#3b82f6' },
  { name: 'Food', value: 28, color: '#f59e0b' },
  { name: 'Energy', value: 37, color: '#8b5cf6' }
];

function MetricCard({ label, value, change, icon: Icon, bgColor, iconColor }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600 text-xs font-medium">{label}</span>
        <div className={`p-1.5 rounded-md ${bgColor}`}>
          <Icon className={iconColor} size={16} />
        </div>
      </div>
      <div className="text-xl font-semibold text-gray-900 mb-1">{value}</div>
      {change && (
        <div className={`text-xs ${change.includes('↓') ? 'text-green-600' : 'text-gray-500'}`}>
          {change}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('week');

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your carbon footprint and environmental impact</p>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-2 mb-6">
          {['day', 'week', 'month'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize text-xs transition-all ${
                dateRange === range 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            label="Total CO₂" 
            value="51.7 kg" 
            change="↓ 12% vs last week" 
            icon={TrendingDown} 
            bgColor="bg-green-100"
            iconColor="text-green-600" 
          />
          <MetricCard 
            label="Transport" 
            value="18.1 kg" 
            change="35% of total" 
            icon={Activity} 
            bgColor="bg-blue-100"
            iconColor="text-blue-600" 
          />
          <MetricCard 
            label="Food" 
            value="14.5 kg" 
            change="28% of total" 
            icon={Leaf} 
            bgColor="bg-orange-100"
            iconColor="text-orange-600" 
          />
          <MetricCard 
            label="Energy" 
            value="19.1 kg" 
            change="37% of total" 
            icon={TrendingUp} 
            bgColor="bg-purple-100"
            iconColor="text-purple-600" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Weekly Carbon Emissions</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={carbonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="transport" stroke="#3b82f6" strokeWidth={2} name="Transport" />
                <Line type="monotone" dataKey="food" stroke="#f59e0b" strokeWidth={2} name="Food" />
                <Line type="monotone" dataKey="energy" stroke="#8b5cf6" strokeWidth={2} name="Energy" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goal Progress */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-emerald-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Goal Progress</h3>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Weekly Goal: 45 kg CO₂</span>
                  <span className="font-semibold text-emerald-600">87%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-emerald-600 h-2.5 rounded-full transition-all" style={{ width: '87%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">6.8 kg remaining</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Monthly Goal: 180 kg CO₂</span>
                  <span className="font-semibold text-blue-600">68%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: '68%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">57.6 kg remaining</p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Comparison</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div>
                  <div className="text-xs text-gray-600 font-medium mb-1">Your Average</div>
                  <div className="text-2xl font-semibold text-gray-900">7.4 kg/day</div>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingDown className="text-emerald-600" size={24} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-200">
                <div>
                  <div className="text-xs text-gray-600 font-medium mb-1">National Average</div>
                  <div className="text-2xl font-semibold text-gray-900">9.8 kg/day</div>
                </div>
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Activity className="text-gray-600" size={24} />
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-700 font-semibold text-sm">You are 24% below average! 🎉</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}