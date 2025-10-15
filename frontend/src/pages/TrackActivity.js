import React, { useState } from 'react';
import { Plus, Activity, Edit2, Trash2, TrendingUp, Calendar, Filter } from 'lucide-react';

const initialActivities = [
  { id: 1, type: 'Car Journey', category: 'Transport', distance: '15km', carbon: 3.2, date: '2 hours ago' },
  { id: 2, type: 'Beef meal', category: 'Food', servings: 1, carbon: 2.1, date: '5 hours ago' },
  { id: 3, type: 'Home energy', category: 'Energy', usage: '12 kWh', carbon: 7.1, date: 'Today' },
  { id: 4, type: 'Bus Commute', category: 'Transport', distance: '8km', carbon: 0.6, date: '2 days ago' }
];

function ActivityItem({ activity, onDelete, onEdit }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-300 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className={`p-2.5 rounded-lg border ${
            activity.category === 'Transport' ? 'bg-blue-50 border-blue-200' :
            activity.category === 'Food' ? 'bg-orange-50 border-orange-200' : 
            'bg-purple-50 border-purple-200'
          }`}>
            <Activity className={
              activity.category === 'Transport' ? 'text-blue-600' :
              activity.category === 'Food' ? 'text-orange-600' : 'text-purple-600'
            } size={18} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">{activity.type}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={12} />
              {activity.date}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <div className="text-right">
              <div className="font-semibold text-gray-900">{activity.carbon} kg CO₂</div>
              <div className="text-xs text-gray-500">{activity.category}</div>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => onEdit(activity)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-200"
            >
              <Edit2 size={14} className="text-blue-600" />
            </button>
            <button 
              onClick={() => onDelete(activity.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200"
            >
              <Trash2 size={14} className="text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={18} className={
            color.includes('emerald') ? 'text-emerald-600' :
            color.includes('blue') ? 'text-blue-600' : 'text-purple-600'
          } />
        </div>
        <div className="text-sm font-medium text-gray-600">{title}</div>
      </div>
      <div className="text-2xl font-semibold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}

export default function TrackActivity() {
  const [activities, setActivities] = useState(initialActivities);
  const [filterCategory, setFilterCategory] = useState('All');
  const [newActivity, setNewActivity] = useState({ 
    category: 'Transport', 
    type: '', 
    distance: '',
    servings: '',
    usage: ''
  });

  const totalCarbon = activities.reduce((sum, a) => sum + a.carbon, 0);
  const avgCarbon = activities.length > 0 ? totalCarbon / activities.length : 0;

  const filteredActivities = filterCategory === 'All' 
    ? activities 
    : activities.filter(a => a.category === filterCategory);

  const handleAddActivity = () => {
    const value = newActivity.category === 'Transport' ? newActivity.distance :
                  newActivity.category === 'Food' ? newActivity.servings :
                  newActivity.usage;
    
    if (newActivity.type && value) {
      const carbon = Math.random() * 5 + 0.5;
      setActivities([{
        id: Date.now(),
        type: newActivity.type,
        category: newActivity.category,
        [newActivity.category === 'Transport' ? 'distance' : 
         newActivity.category === 'Food' ? 'servings' : 'usage']: value,
        carbon: parseFloat(carbon.toFixed(1)),
        date: 'Just now'
      }, ...activities]);
      setNewActivity({ 
        category: newActivity.category, 
        type: '', 
        distance: '',
        servings: '',
        usage: ''
      });
    }
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleEditActivity = (activity) => {
    console.log('Edit activity:', activity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">Activity Logs</h1>
          <p className="text-gray-600">Track and manage your daily activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Total Emissions"
            value={`${totalCarbon.toFixed(1)} kg`}
            subtitle="CO₂ tracked"
            icon={TrendingUp}
            color="bg-emerald-100"
          />
          <StatCard 
            title="Activities Logged"
            value={activities.length}
            subtitle="Total entries"
            icon={Activity}
            color="bg-blue-100"
          />
          <StatCard 
            title="Average Impact"
            value={`${avgCarbon.toFixed(1)} kg`}
            subtitle="Per activity"
            icon={Filter}
            color="bg-purple-100"
          />
        </div>

        {/* Add Activity Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Log New Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                value={newActivity.category}
                onChange={(e) => setNewActivity({ 
                  category: e.target.value, 
                  type: '', 
                  distance: '',
                  servings: '',
                  usage: ''
                })}
              >
                <option value="Transport">🚗 Transport</option>
                <option value="Food">🍽️ Food</option>
                <option value="Energy">⚡ Energy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {newActivity.category === 'Transport' ? 'Transport Type' :
                 newActivity.category === 'Food' ? 'Food Item' : 'Energy Source'}
              </label>
              {newActivity.category === 'Transport' ? (
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  placeholder="e.g., Car Journey, Bus Ride"
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                />
              ) : newActivity.category === 'Food' ? (
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                >
                  <option value="">Select food item</option>
                  <option value="Beef meal">Beef meal</option>
                  <option value="Chicken meal">Chicken meal</option>
                  <option value="Pork meal">Pork meal</option>
                  <option value="Fish meal">Fish meal</option>
                  <option value="Vegetarian meal">Vegetarian meal</option>
                  <option value="Vegan meal">Vegan meal</option>
                  <option value="Dairy products">Dairy products</option>
                  <option value="Rice dish">Rice dish</option>
                  <option value="Pasta dish">Pasta dish</option>
                  <option value="Fast food">Fast food</option>
                </select>
              ) : (
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                >
                  <option value="">Select energy source</option>
                  <option value="Home electricity">Home electricity</option>
                  <option value="Air conditioning">Air conditioning</option>
                  <option value="Heating">Heating</option>
                  <option value="Water heating">Water heating</option>
                  <option value="Office energy">Office energy</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Laundry">Laundry</option>
                </select>
              )}
            </div>
            
            {newActivity.category === 'Transport' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  placeholder="e.g., 15"
                  value={newActivity.distance}
                  onChange={(e) => setNewActivity({ ...newActivity, distance: e.target.value })}
                />
              </div>
            )}

            {newActivity.category === 'Food' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  placeholder="e.g., 1, 2"
                  value={newActivity.servings}
                  onChange={(e) => setNewActivity({ ...newActivity, servings: e.target.value })}
                />
              </div>
            )}

            {newActivity.category === 'Energy' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage (kWh)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  placeholder="e.g., 12"
                  value={newActivity.usage}
                  onChange={(e) => setNewActivity({ ...newActivity, usage: e.target.value })}
                />
              </div>
            )}
          </div>
          <button
            onClick={handleAddActivity}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-all flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            Add Activity
          </button>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity History</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {['All', 'Transport', 'Food', 'Energy'].map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  filterCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                  <Activity className="text-gray-400" size={40} />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-1">No activities found</p>
                <p className="text-gray-600 text-sm">Start tracking your carbon footprint by adding activities above</p>
              </div>
            ) : (
              filteredActivities.map(activity => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity} 
                  onDelete={handleDeleteActivity}
                  onEdit={handleEditActivity}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}