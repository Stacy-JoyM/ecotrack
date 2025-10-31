import React, { useState, useEffect, useCallback } from 'react';
import { TrendingDown, Activity, Zap, Target, Award, Calendar, AlertCircle } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// API Configuration
const API_URL = ' https://ecotrack-ai-backend.onrender.com/api/activity';
const getAuthToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return { success: true, data };
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Colors for categories
const COLORS = {
  transport: '#3b82f6',
  energy: '#8b5cf6',
};

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
        <div className="text-xs text-gray-500">
          {change}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto text-gray-400 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    total_emissions: 0,
    activities_logged: 0,
    average_impact: 0,
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch summary
      const summaryResult = await apiRequest('/summary');
      if (summaryResult.success) {
        setSummary(summaryResult.data.data || summaryResult.data);
      }

      // Fetch activities
      const activitiesResult = await apiRequest('/activities');
      if (activitiesResult.success) {
        const activityList = activitiesResult.data.data || activitiesResult.data || [];
        setActivities(activityList);
        processChartData(activityList, dateRange);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Process activities into chart data
  const processChartData = (activityList, range) => {
    if (!activityList || activityList.length === 0) {
      setChartData([]);
      setCategoryData([]);
      return;
    }

    // Group by date
    const groupedByDate = {};
    const categoryTotals = {
      transport: 0,
      energy: 0,
    };

    activityList.forEach(activity => {
      const date = new Date(activity.timestamp || activity.time);
      const dateKey = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          transport: 0,
          energy: 0,
          total: 0,
        };
      }

      const co2 = activity.co2 || 0;
      const category = activity.category?.toLowerCase() || 'other';
      
      if (category === 'transport') {
        groupedByDate[dateKey].transport += co2;
        categoryTotals.transport += co2;
      } else if (category === 'energy') {
        groupedByDate[dateKey].energy += co2;
        categoryTotals.energy += co2;
      }
      
      groupedByDate[dateKey].total += co2;
    });

    // Convert to array and sort by date
    const chartArray = Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 days

    setChartData(chartArray);

    // Set category pie chart data
    const categoryArray = [
      { name: 'Transport', value: categoryTotals.transport, color: COLORS.transport },
      { name: 'Energy', value: categoryTotals.energy, color: COLORS.energy },
    ].filter(item => item.value > 0);

    setCategoryData(categoryArray);
  };

  // Calculate category percentages
  const transportPercent = summary.total_emissions > 0 
    ? ((categoryData.find(c => c.name === 'Transport')?.value || 0) / summary.total_emissions * 100).toFixed(0)
    : 0;
  
  const energyPercent = summary.total_emissions > 0
    ? ((categoryData.find(c => c.name === 'Energy')?.value || 0) / summary.total_emissions * 100).toFixed(0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-red-900 mb-2 text-center">Error Loading Dashboard</h3>
          <p className="text-red-700 text-center mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasData = activities.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your carbon footprint and environmental impact in Kenya</p>
        </div>

        {!hasData ? (
          /* Empty State - No activities yet */
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200">
            <EmptyState
              icon={Activity}
              title="No Activities Yet"
              description="Start logging your energy usage and transport activities to see your carbon footprint analytics here."
              actionText="Log Your First Activity"
              onAction={() => window.location.href = '/api/activity/activities'} // Adjust route as needed
            />
          </div>
        ) : (
          <>
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
                value={`${summary.total_emissions.toFixed(1)} kg`} 
                change={`${summary.activities_logged} activities logged`}
                icon={TrendingDown} 
                bgColor="bg-green-100"
                iconColor="text-green-600" 
              />
              <MetricCard 
                label="Transport" 
                value={`${(categoryData.find(c => c.name === 'Transport')?.value || 0).toFixed(1)} kg`} 
                change={`${transportPercent}% of total`}
                icon={Activity} 
                bgColor="bg-blue-100"
                iconColor="text-blue-600" 
              />
              <MetricCard 
                label="Energy" 
                value={`${(categoryData.find(c => c.name === 'Energy')?.value || 0).toFixed(1)} kg`} 
                change={`${energyPercent}% of total`}
                icon={Zap} 
                bgColor="bg-purple-100"
                iconColor="text-purple-600" 
              />
              <MetricCard 
                label="Daily Average" 
                value={`${summary.average_impact.toFixed(1)} kg`} 
                change="Per activity"
                icon={Calendar} 
                bgColor="bg-orange-100"
                iconColor="text-orange-600" 
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Line Chart */}
              <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Carbon Emissions Over Time</h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '11px'
                        }} 
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line type="monotone" dataKey="transport" stroke={COLORS.transport} strokeWidth={2} name="Transport" />
                      <Line type="monotone" dataKey="energy" stroke={COLORS.energy} strokeWidth={2} name="Energy" />
                      <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Total" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <Activity size={40} className="mx-auto mb-2 text-gray-400" />
                    <p>No data for selected period</p>
                  </div>
                )}
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Category Breakdown</h3>
                {categoryData.length > 0 ? (
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
                        formatter={(value) => `${value.toFixed(2)} kg`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <Activity size={40} className="mx-auto mb-2 text-gray-400" />
                    <p>No category data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Goal Progress */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-emerald-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">Paris Agreement Goals</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">Based on 1.5°C target: 2,500 kg CO₂/year per person by 2030</p>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Weekly Goal: 48 kg CO₂</span>
                      <span className={`font-semibold ${summary.total_emissions <= 48 ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {((summary.total_emissions / 48) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all ${summary.total_emissions <= 48 ? 'bg-emerald-600' : 'bg-orange-600'}`}
                        style={{ width: `${Math.min((summary.total_emissions / 48) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {summary.total_emissions <= 48 
                        ? `${(48 - summary.total_emissions).toFixed(1)} kg remaining` 
                        : `${(summary.total_emissions - 48).toFixed(1)} kg over goal`}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Monthly Goal: 208 kg CO₂</span>
                      <span className={`font-semibold ${summary.total_emissions <= 208 ? 'text-blue-600' : 'text-red-600'}`}>
                        {((summary.total_emissions / 208) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all ${summary.total_emissions <= 208 ? 'bg-blue-600' : 'bg-red-600'}`}
                        style={{ width: `${Math.min((summary.total_emissions / 208) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {summary.total_emissions <= 208 
                        ? `${(208 - summary.total_emissions).toFixed(1)} kg remaining` 
                        : `${(summary.total_emissions - 208).toFixed(1)} kg over goal`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">How You Compare</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div>
                      <div className="text-xs text-gray-600 font-medium mb-1">Your Average</div>
                      <div className="text-2xl font-semibold text-gray-900">{summary.average_impact.toFixed(1)} kg</div>
                      <div className="text-xs text-gray-500">per activity</div>
                    </div>
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingDown className="text-emerald-600" size={24} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div>
                      <div className="text-xs text-gray-600 font-medium mb-1">Kenya Average</div>
                      <div className="text-2xl font-semibold text-gray-900">1.07 kg</div>
                      <div className="text-xs text-gray-500">CO₂ per person/day (2023)</div>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <div className="text-xs text-gray-600 font-medium mb-1">Global Target (2030)</div>
                      <div className="text-2xl font-semibold text-gray-900">6.8 kg</div>
                      <div className="text-xs text-gray-500">CO₂ per person/day (Paris Agreement)</div>
                    </div>
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <Target className="text-gray-600" size={24} />
                    </div>
                  </div>
                  {summary.average_impact < 7 && (
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-700 font-semibold text-sm">
                        {summary.average_impact < 1.07 
                          ? "🌟 Below Kenya's average! Excellent work!" 
                          : summary.average_impact < 6.8
                          ? "✅ You're on track with Paris Agreement goals!"
                          : "Keep tracking to reach your goals! 💪"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}