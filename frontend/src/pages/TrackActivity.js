import React, { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, Zap, Plus, Car, Trash2 } from 'lucide-react';
import { activityApi } from '../services/activityApi';

// Hardcoded energy types - no need to fetch from backend
const ENERGY_TYPES = [
  { value: 'home_electricity', label: 'Home Electricity' },
  { value: 'air_conditioning', label: 'Air Conditioning' },
  { value: 'heating', label: 'Heating' },
  { value: 'water_heating', label: 'Water Heating' },
  { value: 'office_energy', label: 'Office Energy' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'laundry', label: 'Laundry' }
];

export default function TrackActivity() {
  const [category, setCategory] = useState('energy');
  const [energySource, setEnergySource] = useState('');
  const [usageKwh, setUsageKwh] = useState('');
  const [vehicleType, setVehicleType] = useState('petrol');
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');
  
  const [summary, setSummary] = useState({
    total_emissions: 0,
    activities_logged: 0,
    average_impact: 0
  });
  const [history, setHistory] = useState([]);
  const [filterTab, setFilterTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSummary = useCallback(async () => {
    try {
      const response = await activityApi.getSummary();
      if (response.success) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const response = await activityApi.getHistory(filterTab);
      if (response.success) {
        setHistory(response.data);
      }
    } catch (err) {
      console.error('Error loading history:', err);
    }
  }, [filterTab]);

  // Load initial data
  useEffect(() => {
    loadSummary();
    loadHistory();
  }, [loadSummary, loadHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let activityData;

      if (category === 'transport') {
        if (!distance) {
          setError('Please enter distance');
          setLoading(false);
          return;
        }
        activityData = {
          category: 'transport',
          vehicle_type: vehicleType,
          distance: parseFloat(distance),
          notes: notes || `${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} Journey`
        };
      } else {
        if (!energySource || !usageKwh) {
          setError('Please select energy source and enter usage');
          setLoading(false);
          return;
        }
        activityData = {
          category: 'energy',
          energy_type: energySource,
          usage_kwh: parseFloat(usageKwh),
          notes: notes || ENERGY_TYPES.find(t => t.value === energySource)?.label
        };
      }

      const response = await activityApi.createActivity(activityData);

      if (response.success) {
        // Reset form
        setEnergySource('');
        setUsageKwh('');
        setDistance('');
        setNotes('');
        
        // Reload data
        await loadSummary();
        await loadHistory();
        
        // Show success message
        alert(`Activity logged! CO₂ emission: ${response.data.co2_emission.toFixed(1)} kg`);
      }
    } catch (err) {
      setError(err.message || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      const response = await activityApi.deleteActivity(activityId);
      if (response.success) {
        await loadSummary();
        await loadHistory();
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
          <p className="text-gray-600">Track and manage your daily activities</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="text-emerald-600" size={20} />
              </div>
              <span className="text-gray-600 text-sm font-medium">Total Emissions</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{summary.total_emissions} kg</p>
            <p className="text-sm text-gray-500 mt-1">CO₂ tracked</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="text-blue-600" size={20} />
              </div>
              <span className="text-gray-600 text-sm font-medium">Activities Logged</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{summary.activities_logged}</p>
            <p className="text-sm text-gray-500 mt-1">Total entries</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="text-purple-600" size={20} />
              </div>
              <span className="text-gray-600 text-sm font-medium">Average Impact</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{summary.average_impact} kg</p>
            <p className="text-sm text-gray-500 mt-1">Per activity</p>
          </div>
        </div>

        {/* Log New Activity Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Log New Activity</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="energy">⚡ Energy</option>
                  <option value="transport">🚗 Transport</option>
                </select>
              </div>

              {/* Conditional Fields Based on Category */}
              {category === 'energy' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Energy Source</label>
                    <select
                      value={energySource}
                      onChange={(e) => setEnergySource(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select energy source</option>
                      {ENERGY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage (kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 12"
                      value={usageKwh}
                      onChange={(e) => setUsageKwh(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="petrol">Petrol</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 25"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {/* Notes (Optional) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <input
                type="text"
                placeholder="Add a description..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            {['all', 'transport', 'energy'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterTab(filter)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  filterTab === filter
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* History List */}
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No activities logged yet</p>
            ) : (
              history.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      activity.category_lowercase === 'transport' 
                        ? 'bg-blue-100' 
                        : 'bg-purple-100'
                    }`}>
                      {activity.category_lowercase === 'transport' ? (
                        <Car className="text-blue-600" size={20} />
                      ) : (
                        <Zap className="text-purple-600" size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{activity.co2} kg CO₂</p>
                      <p className="text-xs text-gray-500">{activity.category}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete activity"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}