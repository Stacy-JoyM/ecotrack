import React, { useState } from 'react';
import { Search, MapPin, Heart, Star, Navigation, Leaf, ShoppingBag, Utensils, Bus, Award, TrendingUp } from 'lucide-react';

const ecoLocations = [
  { 
    id: 1, 
    name: 'Green Grocers Market', 
    category: 'Food', 
    distance: '0.8 km', 
    rating: 4.8,
    reviews: 234,
    impact: 'Saves 2.5kg CO₂',
    description: 'Organic produce and locally sourced items',
    saved: false,
    tags: ['Organic', 'Local', 'Zero Waste']
  },
  { 
    id: 2, 
    name: 'EcoCycle Bike Share', 
    category: 'Transport', 
    distance: '0.3 km', 
    rating: 4.6,
    reviews: 189,
    impact: 'Saves 3.2kg CO₂',
    description: 'Electric bike rental stations citywide',
    saved: true,
    tags: ['Electric', 'Convenient', 'Affordable']
  },
  { 
    id: 3, 
    name: 'Solar Cafe', 
    category: 'Food', 
    distance: '1.2 km', 
    rating: 4.9,
    reviews: 312,
    impact: 'Saves 1.8kg CO₂',
    description: 'Plant-based meals, solar-powered kitchen',
    saved: false,
    tags: ['Vegan', 'Solar', 'Sustainable']
  },
  { 
    id: 4, 
    name: 'Public Transit Hub', 
    category: 'Transport', 
    distance: '0.5 km', 
    rating: 4.5,
    reviews: 156,
    impact: 'Saves 4.1kg CO₂',
    description: 'Central station with electric buses',
    saved: false,
    tags: ['Public', 'Electric', 'Fast']
  },
  { 
    id: 5, 
    name: 'EcoMart Superstore', 
    category: 'Shopping', 
    distance: '1.5 km', 
    rating: 4.7,
    reviews: 428,
    impact: 'Saves 2.0kg CO₂',
    description: 'Sustainable products and refill station',
    saved: true,
    tags: ['Bulk Buy', 'Refills', 'Plastic-Free']
  },
  { 
    id: 6, 
    name: 'Green Wheels Carpool', 
    category: 'Transport', 
    distance: '0.2 km', 
    rating: 4.8,
    reviews: 267,
    impact: 'Saves 5.5kg CO₂',
    description: 'Community carpooling network',
    saved: false,
    tags: ['Carpool', 'Community', 'Cost-Effective']
  }
];

const categoryIcons = {
  Food: Utensils,
  Transport: Bus,
  Shopping: ShoppingBag
};



const categoryBadgeColors = {
  Food: 'bg-orange-100 text-orange-700 border-orange-200',
  Transport: 'bg-blue-100 text-blue-700 border-blue-200',
  Shopping: 'bg-purple-100 text-purple-700 border-purple-200'
};

function LocationCard({ location, onToggleSave }) {
  const Icon = categoryIcons[location.category] || Leaf;
  
  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 overflow-hidden">
      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              location.category === 'Food' ? 'bg-orange-50 border border-orange-200' :
              location.category === 'Transport' ? 'bg-blue-50 border border-blue-200' : 
              'bg-purple-50 border border-purple-200'
            }`}>
              <Icon className={
                location.category === 'Food' ? 'text-orange-600' :
                location.category === 'Transport' ? 'text-blue-600' : 'text-purple-600'
              } size={20} />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${categoryBadgeColors[location.category]}`}>
              {location.category}
            </span>
          </div>
          <button 
            onClick={() => onToggleSave(location.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Heart 
              size={18} 
              className={location.saved ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2">{location.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{location.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {location.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={14} className="text-gray-500" />
            <span className="text-sm">{location.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">{location.rating}</span>
            <span className="text-xs text-gray-500">({location.reviews})</span>
          </div>
        </div>

        {/* Impact Badge */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <TrendingUp size={14} className="text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">{location.impact}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium text-sm">
            View Details
          </button>
          <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
            <Navigation size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className={
            color.includes('emerald') ? 'text-emerald-600' :
            color.includes('red') ? 'text-red-600' :
            color.includes('yellow') ? 'text-yellow-600' : 'text-blue-600'
          } size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function Discover() {
  const [locations, setLocations] = useState(ecoLocations);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSaveLocation = (id) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, saved: !loc.saved } : loc
    ));
  };

  const filteredLocations = locations.filter(loc => {
    const matchesCategory = filterCategory === 'All' || loc.category === filterCategory;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const savedCount = locations.filter(loc => loc.saved).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">Discover Eco-Friendly Places</h1>
          <p className="text-gray-600">Find sustainable alternatives near you</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={Leaf}
            label="Total Places"
            value={locations.length}
            color="bg-emerald-100"
          />
          <StatCard 
            icon={Heart}
            label="Saved"
            value={savedCount}
            color="bg-red-100"
          />
          <StatCard 
            icon={Award}
            label="Avg Rating"
            value="4.7"
            color="bg-yellow-100"
          />
          <StatCard 
            icon={TrendingUp}
            label="CO₂ Saved"
            value="19.1kg"
            color="bg-blue-100"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="Search for eco-friendly places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap">
              {['All', 'Food', 'Transport', 'Shopping'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-5 py-3 rounded-lg font-semibold transition-all ${
                    filterCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredLocations.length}</span> {filteredLocations.length === 1 ? 'place' : 'places'}
          </p>
        </div>

        {/* Locations Grid */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map(location => (
              <LocationCard 
                key={location.id} 
                location={location} 
                onToggleSave={toggleSaveLocation} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Search className="mx-auto mb-4 text-gray-300" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No places found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}