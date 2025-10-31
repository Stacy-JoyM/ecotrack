import React, { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, Zap, Plus, Car, Trash2, AlertCircle } from 'lucide-react';

// API Configuration
const API_URL = 'http://localhost:5000/api/activity';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// API Helper with Authentication
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

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Constants with proper units for Kenya
const ENERGY_TYPES = [
  { 
    value: 'electricity', 
    label: '⚡ Electricity', 
    unit: 'kwh',
    unitLabel: 'kWh',
    placeholder: 'e.g., 150'
  },
  { 
    value: 'gas', 
    label: '🔥 Natural Gas', 
    unit: 'm3',
    unitLabel: 'm³',
    placeholder: 'e.g., 10'
  },
  { 
    value: 'lpg', 
    label: '🔥 LPG (Cooking Gas)', 
    unit: 'kg',
    unitLabel: 'kg',
    placeholder: 'e.g., 5'
  },
  { 
    value: 'kerosene', 
    label: '🪔 Kerosene', 
    unit: 'liters',
    unitLabel: 'Liters',
    placeholder: 'e.g., 10'
  },
  { 
    value: 'charcoal', 
    label: '🪵 Charcoal', 
    unit: 'kg',
    unitLabel: 'kg',
    placeholder: 'e.g., 20'
  },
  { 
    value: 'firewood', 
    label: '🌳 Firewood', 
    unit: 'kg',
    unitLabel: 'kg',
    placeholder: 'e.g., 30'
  },
  { 
    value: 'solar', 
    label: '☀️ Solar Energy', 
    unit: 'kwh',
    unitLabel: 'kWh',
    placeholder: 'e.g., 100'
  },
  { 
    value: 'wind', 
    label: '💨 Wind Energy', 
    unit: 'kwh',
    unitLabel: 'kWh',
    placeholder: 'e.g., 50'
  },
  { 
    value: 'biogas', 
    label: '♻️ Biogas', 
    unit: 'm3',
    unitLabel: 'm³',
    placeholder: 'e.g., 15'
  },
];

const VEHICLE_TYPES = [
  { value: 'petrol', label: '⛽ Petrol Car' },
  { value: 'electric', label: '🔋 Electric Car' },
  { value: 'diesel', label: '⛽ Diesel Car' },
  { value: 'hybrid', label: '🔋⛽ Hybrid Car' },
  { value: 'motorcycle', label: '🏍️ Motorcycle (Bodaboda)' },
  { value: 'bus', label: '🚌 Bus/Matatu' },
  { value: 'van_diesel', label: '🚐 Diesel Van' },
  { value: 'truck_light', label: '🚚 Light Truck' },
  { value: 'truck_heavy', label: '🚛 Heavy Truck' },
];

export default function TrackActivity() {
  const [category, setCategory] = useState('energy');

  // Energy
  const [energyType, setEnergyType] = useState('');
  const [energyAmount, setEnergyAmount] = useState('');

  // Transport
  const [vehicleType, setVehicleType] = useState('petrol');
  const [distance, setDistance] = useState('');

  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState({
    total_emissions: 0,
    activities_logged: 0,
    average_impact: 0,
  });
  const [history, setHistory] = useState([]);
  const [filterTab, setFilterTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get selected energy type details
  const selectedEnergyType = ENERGY_TYPES.find(t => t.value === energyType);

  // Load Summary
  const loadSummary = useCallback(async () => {
    try {
      const result = await apiRequest('/summary');
      if (result.success) {
        setSummary(result.data.data || result.data);
      }
    } catch (err) {
      console.error('Error loading summary:', err);
      // Don't show error for summary - it's not critical
    }
  }, []);

  // Load History
  const loadHistory = useCallback(async () => {
    setDataLoading(true);
    try {
      const endpoint = filterTab === 'all' 
        ? '/activities' 
        : `/activities?category=${filterTab}`;
      
      const result = await apiRequest(endpoint);
      
      if (result.success) {
        const activities = result.data.data || result.data || [];
        setHistory(activities);
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Failed to load activity history. Please try again.');
    } finally {
      setDataLoading(false);
    }
  }, [filterTab]);

  useEffect(() => {
    loadSummary();
    loadHistory();
  }, [loadSummary, loadHistory]);

  // Auto-clear messages
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError('');
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  // Validate form
  const validateForm = () => {
    if (category === 'transport') {
      if (!distance || parseFloat(distance) <= 0) {
        setError('Please enter a valid distance greater than 0');
        return false;
      }
    } else if (category === 'energy') {
      if (!energyType) {
        setError('Please select an energy type');
        return false;
      }
      if (!energyAmount || parseFloat(energyAmount) <= 0) {
        setError('Please enter a valid energy amount greater than 0');
        return false;
      }
    }
    return true;
  };

  // Submit New Activity
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let activityData = {};

      if (category === 'transport') {
        activityData = {
          category: 'transport',
          vehicle_type: vehicleType,
          distance_km: parseFloat(distance),
          notes: notes || `${VEHICLE_TYPES.find(v => v.value === vehicleType)?.label} Journey`,
        };
      } else if (category === 'energy') {
        const energyTypeInfo = ENERGY_TYPES.find(t => t.value === energyType);
        
        activityData = {
          category: 'energy',
          energy_type: energyType,
          energy_amount: parseFloat(energyAmount),
          energy_unit: energyTypeInfo?.unit || 'kwh',
          notes: notes || energyTypeInfo?.label,
        };
      }

      // Send to backend
      const result = await apiRequest('/activities', {
        method: 'POST',
        body: JSON.stringify(activityData),
      });

      if (result.success) {
        const responseData = result.data;
        
        // Add new activity to UI
        const newActivity = {
          id: responseData.activity?.id || Date.now(),
          title: notes || activityData.notes || activityData.energy_type || activityData.vehicle_type,
          category: category,
          co2: responseData.emission_kg || 0,
          time: new Date().toLocaleString(),
          category_lowercase: category,
        };
        
        setHistory((prev) => [newActivity, ...prev]);

        // Update summary
        setSummary(prev => ({
          total_emissions: prev.total_emissions + (responseData.emission_kg || 0),
          activities_logged: prev.activities_logged + 1,
          average_impact: ((prev.total_emissions + (responseData.emission_kg || 0)) / (prev.activities_logged + 1)).toFixed(2),
        }));

        // Reset form
        setEnergyType('');
        setEnergyAmount('');
        setDistance('');
        setNotes('');
        
        setSuccessMessage(`Activity logged! CO₂ emission: ${responseData.emission_kg?.toFixed(2) || 0} kg`);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to log activity. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Activity
  const handleDelete = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      const result = await apiRequest(`/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (result.success) {
        // Remove from UI
        const deletedActivity = history.find(a => a.id === activityId);
        setHistory((prev) => prev.filter((a) => a.id !== activityId));
        
        // Update summary
        if (deletedActivity) {
          setSummary(prev => ({
            total_emissions: Math.max(0, prev.total_emissions - (deletedActivity.co2 || 0)),
            activities_logged: Math.max(0, prev.activities_logged - 1),
            average_impact: prev.activities_logged > 1 
              ? ((prev.total_emissions - (deletedActivity.co2 || 0)) / (prev.activities_logged - 1)).toFixed(2)
              : 0,
          }));
        }
        
        setSuccessMessage('Activity deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
          <p className="text-gray-600">Track and manage your daily carbon footprint in Kenya</p>
        </div>

        {/* Global Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError('')} className="ml-auto text-red-700 hover:text-red-900 text-xl">×</button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3">
            <Zap size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Success</p>
              <p className="text-sm">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage('')} className="ml-auto text-green-700 hover:text-green-900 text-xl">×</button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard 
            icon={<TrendingUp className="text-emerald-600" size={20} />} 
            title="Total Emissions" 
            value={`${summary.total_emissions.toFixed(2)} kg`} 
            subtitle="CO₂ tracked" 
            color="emerald" 
          />
          <SummaryCard 
            icon={<Activity className="text-blue-600" size={20} />} 
            title="Activities Logged" 
            value={summary.activities_logged} 
            subtitle="Total entries" 
            color="blue" 
          />
          <SummaryCard 
            icon={<Zap className="text-purple-600" size={20} />} 
            title="Average Impact" 
            value={`${parseFloat(summary.average_impact).toFixed(2)} kg`} 
            subtitle="Per activity" 
            color="purple" 
          />
        </div>

        {/* Log New Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Log New Activity</h2>

          <form onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCategory('energy')}
                  className={`p-4 rounded-lg border-2 transition ${
                    category === 'energy'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Zap className="mx-auto mb-2" size={24} />
                  <p className="font-semibold">Energy</p>
                  <p className="text-xs mt-1 opacity-75">Electricity, Gas, LPG, etc.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('transport')}
                  className={`p-4 rounded-lg border-2 transition ${
                    category === 'transport'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Car className="mx-auto mb-2" size={24} />
                  <p className="font-semibold">Transport</p>
                  <p className="text-xs mt-1 opacity-75">Cars, Buses, Motorcycles, etc.</p>
                </button>
              </div>
            </div>

            {/* Energy Form */}
            {category === 'energy' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Select label="Energy Type" value={energyType} onChange={setEnergyType} required>
                    <option value="">Select energy type</option>
                    {ENERGY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                  
                  {energyType && (
                    <Input 
                      label={`Amount (${selectedEnergyType?.unitLabel || 'units'})`}
                      value={energyAmount} 
                      onChange={setEnergyAmount} 
                      placeholder={selectedEnergyType?.placeholder || 'Enter amount'} 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      required
                    />
                  )}
                </div>

                {/* Info boxes for specific energy types */}
                {energyType === 'lpg' && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Standard LPG cylinder sizes in Kenya: 6kg, 13kg, or 50kg
                  </div>
                )}
                
                {energyType === 'charcoal' && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    💡 <strong>Tip:</strong> A typical bag of charcoal weighs about 20-25 kg
                  </div>
                )}
              </>
            )}

            {/* Transport Form */}
            {category === 'transport' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select label="Vehicle Type" value={vehicleType} onChange={setVehicleType}>
                  {VEHICLE_TYPES.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </Select>
                <Input 
                  label="Distance (km)" 
                  value={distance} 
                  onChange={setDistance} 
                  placeholder="e.g., 25" 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  required
                />
              </div>
            )}

            {/* Notes field */}
            <div className="mb-4">
              <Input 
                label="Notes (Optional)" 
                value={notes} 
                onChange={setNotes} 
                placeholder="Add a description..." 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <Plus size={20} />
              {loading ? 'Adding...' : 'Add Activity'}
            </button>
          </form>
        </div>

        {/* Activity History */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity History</h2>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {['all', 'transport', 'energy'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  filterTab === tab ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* History List */}
          {dataLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-gray-500 mt-4">Loading activities...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 text-lg">No activities logged yet</p>
                  <p className="text-gray-400 text-sm mt-2">Start tracking your carbon footprint above</p>
                </div>
              ) : (
                history.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${a.category === 'transport' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                        {a.category === 'transport' ? <Car className="text-blue-600" size={20} /> : <Zap className="text-purple-600" size={20} />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{a.title}</h3>
                        <p className="text-sm text-gray-500">{a.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{typeof a.co2 === 'number' ? a.co2.toFixed(2) : a.co2} kg CO₂</p>
                        <p className="text-xs text-gray-500 capitalize">{a.category}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(a.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// UI Helper Components
function SummaryCard({ icon, title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        <span className="text-gray-600 text-sm font-medium">{title}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function Input({ label, value, onChange, required, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
      />
    </div>
  );
}

function Select({ label, value, onChange, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
      >
        {children}
      </select>
    </div>
  );
}
