import React, {useState} from "react";
import ActivityCard from "../components/ActivityCard";
import LogActivityForm from "../components/LogActivityForm";
import {  Search, Plus, Car, Utensils, Zap, Bus} from 'lucide-react';

// Track Activity Page Component
const TrackActivity = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [activities, setActivities] = useState([
    { id: 1, icon: Car, title: 'Car Journey - 15km', time: '2 hours ago', carbon: '3.2', bgColor: 'bg-blue-100' },
    { id: 2, icon: Utensils, title: 'Beef meal', time: '5 hours ago', carbon: '2.1', bgColor: 'bg-yellow-100' },
    { id: 3, icon: Zap, title: 'Home energy usage', time: 'Today', carbon: '7.1', bgColor: 'bg-purple-100' },
    { id: 4, icon: Bus, title: 'Bus Commute', time: '2 days ago', carbon: '0.6', bgColor: 'bg-blue-100' }
  ]);

  const filters = ['All', 'Transport', 'Food', 'Energy'];

  const handleAddActivity = (formData) => {
    const newActivity = {
      id: Date.now(),
      icon: Car,
      title: `${formData.type} - ${formData.distance}km`,
      time: 'Just now',
      carbon: (parseFloat(formData.distance) * 0.21).toFixed(1),
      bgColor: 'bg-blue-100'
    };
    setActivities([newActivity, ...activities]);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus size={20} />
            Add New Activity
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex gap-2 mb-6">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedFilter === filter
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activities.map(activity => (
            <ActivityCard key={activity.id} {...activity} />
          ))}
        </div>
      </div>

      {showForm && (
        <LogActivityForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddActivity}
        />
      )}
    </div>
  );
};
export default TrackActivity; 