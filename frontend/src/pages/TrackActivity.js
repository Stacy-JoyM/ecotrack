import React, { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, Zap, Plus, Car, Trash2 } from 'lucide-react';
import { activityApi } from '../services/activityApi';

// Updated ENERGY_TYPES to match backend
const ENERGY_TYPES = [
  { value: 'electricity', label: '⚡ Electricity' },
  { value: 'gas', label: '🔥 Natural Gas' },
  { value: 'lpg', label: '🔥 LPG (Cooking Gas)' },
  { value: 'kerosene', label: '🪔 Kerosene' },
  { value: 'solar', label: '☀️ Solar Energy' },
  { value: 'wind', label: '💨 Wind Energy' },
  { value: 'biogas', label: '♻️ Biogas' }
];

// Voltage levels for electricity only
const VOLTAGE_LEVELS = [
  { value: 'low_voltage', label: 'Household (Low Voltage)' },
  { value: 'medium_voltage', label: 'Commercial (Medium Voltage)' },
  { value: 'high_voltage', label: 'Industrial (High Voltage)' }
];

// Updated VEHICLE_TYPES to match backend
const VEHICLE_TYPES = [
  { value: 'petrol', label: '⛽ Petrol Car' },
  { value: 'electric', label: '🔋 Electric Car' },
  { value: 'diesel', label: '⛽ Diesel Car' },
  { value: 'hybrid', label: '🔋⛽ Hybrid Car' },
  { value: 'motorcycle', label: '🏍️ Motorcycle' },
  { value: 'bus', label: '🚌 Bus' },
  { value: 'van_diesel', label: '🚐 Diesel Van' },
  { value: 'truck_light', label: '🚚 Light Truck' },
  { value: 'truck_heavy', label: '🚛 Heavy Truck' }
];

export default function TrackActivity() {
  const [category, setCategory] = useState('energy');
  
  // Energy fields
  const [energyType, setEnergyType] = useState('');
  const [energyAmount, setEnergyAmount] = useState('');
  const [energyUnit, setEnergyUnit] = useState('kwh');
  const [voltageLevel, setVoltageLevel] = useState('low_voltage');
  
  // Transport fields
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
          distance_km: parseFloat(distance),
          notes: notes || `${VEHICLE_TYPES.find(v => v.value === vehicleType)?.label} Journey`
        };
        
      } else if (category === 'energy') {
        if (!energyType || !energyAmount) {
          setError('Please select energy type and enter amount');
          setLoading(false);
          return;
        }
        
        activityData = {
          category: 'energy',
          energy_type: energyType,
          energy_amount: parseFloat(energyAmount),
          energy_unit: energyUnit,
          notes: notes || ENERGY_TYPES.find(t => t.value === energyType)?.label
        };
        
        // Add voltage level only for electricity
        if (energyType === 'electricity') {
          activityData.voltage_level = voltageLevel;
        }
      }

      const response = await activityApi.createActivity(activityData);

      if (response.success) {
        // Reset form
        setEnergyType('');
        setEnergyAmount('');
        setEnergyUnit('kwh');
        setVoltageLevel('low_voltage');
        setDistance('');
        setNotes('');
        
        // Reload data
        await loadSummary();
        await loadHistory();
        
        // Show success message
        alert(`Activity logged! CO₂ emission: ${response.data.emission_kg.toFixed(2)} kg`);
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Energy Type</label>
                    <select
                      value={energyType}
                      onChange={(e) => setEnergyType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select energy type</option>
                      {ENERGY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy Amount ({energyUnit.toUpperCase()})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 150"
                      value={energyAmount}
                      onChange={(e) => setEnergyAmount(e.target.value)}
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
                      {VEHICLE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
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

            {/* Additional row for energy-specific fields */}
            {category === 'energy' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Energy Unit</label>
                  <select
                    value={energyUnit}
                    onChange={(e) => setEnergyUnit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="kwh">kWh (Kilowatt-hour)</option>
                    <option value="mwh">MWh (Megawatt-hour)</option>
                  </select>
                </div>

                {/* Show voltage level only for electricity */}
                {energyType === 'electricity' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Voltage Level</label>
                    <select
                      value={voltageLevel}
                      onChange={(e) => setVoltageLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {VOLTAGE_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

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