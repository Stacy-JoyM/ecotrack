import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Heart, Star, Navigation,
  Leaf, ShoppingBag, Utensils, Bus, Award, TrendingUp
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const allLocations = [
  { id: 1, name: 'Green Grocers Market', category: 'Food', coords: [36.8219, -1.2821], rating: 4.8 },
  { id: 2, name: 'Eco Cycle Center', category: 'Transport', coords: [36.811, -1.295], rating: 4.6 },
  { id: 3, name: 'Electric Boda Station', category: 'Transport', coords: [36.825, -1.288], rating: 4.5 },
  { id: 4, name: 'Solar Living Hub', category: 'Energy', coords: [36.835, -1.3], rating: 4.9 },
  { id: 5, name: 'Green Energy Solutions', category: 'Energy', coords: [36.827, -1.278], rating: 4.7 },
  { id: 6, name: 'EcoMart Plaza', category: 'Shopping', coords: [36.8225, -1.283], rating: 4.4 },
  { id: 7, name: 'Sustainable Styles Boutique', category: 'Shopping', coords: [36.818, -1.285], rating: 4.3 },
  { id: 8, name: 'Nairobi Recycling Hub', category: 'Recycling', coords: [36.819, -1.296], rating: 4.7 },
  { id: 9, name: 'Green Waste Collectors', category: 'Recycling', coords: [36.826, -1.291], rating: 4.5 },
];

const HeartButton = ({ locationId }) => {
  const [liked, setLiked] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('likedPlaces') || '[]');
    return saved.includes(locationId);
  });

  const toggleLike = () => {
    const saved = JSON.parse(localStorage.getItem('likedPlaces') || '[]');
    const updated = liked ? saved.filter((id) => id !== locationId) : [...saved, locationId];
    localStorage.setItem('likedPlaces', JSON.stringify(updated));
    setLiked(!liked);
  };

  return (
    <Heart
      onClick={(e) => {
        e.stopPropagation();
        toggleLike();
      }}
      className={`w-5 h-5 cursor-pointer transition ${
        liked ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
      }`}
    />
  );
};

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState([36.8219, -1.2921]);
  const [map, setMap] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [markers, setMarkers] = useState([]);
  const [clickedMarker, setClickedMarker] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;
    if (!mapboxgl.supported()) {
      console.error('Mapbox GL not supported in this browser.');
      return;
    }

    const container = mapContainerRef.current;
    while (container.firstChild) container.removeChild(container.firstChild);

    const newMap = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates,
      zoom: 12,
    });

    newMap.on('load', () => {
      console.log('Map loaded successfully');

      newMap.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/discover/reverse?lng=${lng}&lat=${lat}`);
          const data = await res.json();
          console.log('You clicked:', data.place_name);

          if (clickedMarker) clickedMarker.remove();

          const marker = new mapboxgl.Marker({ color: '#ff5722' })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText(data.place_name))
            .addTo(newMap);

          setClickedMarker(marker);
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
        }
      });
    });

    mapRef.current = newMap;
    setMap(newMap);

    return () => {
      newMap.remove();
      mapRef.current = null;
    };
  }, [coordinates, clickedMarker]);

  useEffect(() => {
    if (!map) return;
    
    // Remove existing markers
    // eslint-disable-next-line react-hooks/exhaustive-deps
    markers.forEach((m) => m.remove());

    const filtered = selectedCategory === 'All'
      ? allLocations
      : allLocations.filter((loc) => loc.category === selectedCategory);

    const newMarkers = filtered.map((loc) => {
      const marker = new mapboxgl.Marker({ color: '#10b981' })
        .setLngLat(loc.coords)
        .setPopup(new mapboxgl.Popup().setText(loc.name))
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        map.flyTo({ center: loc.coords, zoom: 14 });
      });

      return marker;
    });

    setMarkers(newMarkers);
    
    // Cleanup function to remove markers when component unmounts or dependencies change
    return () => {
      newMarkers.forEach((m) => m.remove());
    };
    // 'markers' is intentionally excluded from dependencies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedCategory]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !map) return;
    try {
      const geoRes = await fetch(`http://127.0.0.1:5000/api/discover/geocode?place=${searchQuery}`);
      const geoData = await geoRes.json();

      if (geoData?.coordinates) {
        const coords = geoData.coordinates;
        setCoordinates(coords);
        map.flyTo({ center: coords, zoom: 13 });
        new mapboxgl.Marker({ color: '#2563eb' }).setLngLat(coords).addTo(map);
      } else {
        console.error('No coordinates returned from backend');
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const categories = [
    { label: 'All', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Transport', icon: <Bus className="w-5 h-5" /> },
    { label: 'Food', icon: <Utensils className="w-5 h-5" /> },
    { label: 'Energy', icon: <Leaf className="w-5 h-5" /> },
    { label: 'Shopping', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Recycling', icon: <Award className="w-5 h-5" /> },
  ];

  const filteredLocations =
    selectedCategory === 'All'
      ? allLocations
      : allLocations.filter((loc) => loc.category === selectedCategory);

  return (
    <div className="relative h-[90vh] w-full">
      <div
        ref={mapContainerRef}
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{ minHeight: '500px' }}
      />

      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl w-[90%] max-w-3xl p-4 flex flex-col gap-4 z-10">
        <div className="flex items-center gap-3">
          <Navigation className="text-emerald-500 w-6 h-6" />
          <h1 className="text-xl font-semibold text-gray-800">Discover Eco Places</h1>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search nearby eco-places..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                selectedCategory === cat.label
                  ? 'bg-emerald-500 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-emerald-100'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-6xl overflow-x-auto flex gap-4 p-4 scrollbar-hide z-10">
        {filteredLocations.map((loc) => (
          <div
            key={loc.id}
            className="min-w-[250px] bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-2xl transition"
            onClick={() => map?.flyTo({ center: loc.coords, zoom: 14 })}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{loc.name}</h3>
              <HeartButton locationId={loc.id} />
            </div>

            <div className="flex items-center text-gray-500 text-sm gap-1">
              <MapPin className="w-4 h-4" />
              <span>{loc.distance}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{loc.rating} rating</span>
            </div>
            <div className="text-emerald-600 font-medium text-sm">{loc.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
