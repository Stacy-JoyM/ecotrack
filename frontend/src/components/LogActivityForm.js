import React, {useState} from "react";

// Log New Activity Form Component
const LogActivityForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: 'Transport',
    type: 'Car(Petrol)',
    amount: '',
    dateTime: ''
  });

  // Define type options for each category
  const typeOptions = {
    Transport: ['Car(Petrol)', 'Car(Diesel)', 'Bus', 'Train', 'Bicycle', 'Motorcycle', 'Flight'],
    Food: ['Beef', 'Chicken', 'Pork', 'Fish', 'Vegetables', 'Dairy', 'Processed Food'],
    Energy: ['Electricity', 'Natural Gas', 'Heating Oil', 'Coal', 'Appliance']
  };

  // Define labels and placeholders for each category
  const categoryConfig = {
    Transport: {
      typeLabel: 'Mode of Transport',
      amountLabel: 'Distance (km)',
      amountPlaceholder: 'Enter distance traveled',
      dateLabel: 'When did you travel?'
    },
    Food: {
      typeLabel: 'What did you eat?',
      amountLabel: 'Amount (servings)',
      amountPlaceholder: 'Enter number of servings',
      dateLabel: 'When did you eat?'
    },
    Energy: {
      typeLabel: 'Energy Source / Appliance',
      amountLabel: 'Usage (kWh or hours)',
      amountPlaceholder: 'Enter usage amount',
      dateLabel: 'When was it used?'
    }
  };

  // Handle category change and reset type to first option
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const firstType = typeOptions[newCategory][0];
    setFormData({ 
      ...formData, 
      category: newCategory,
      type: firstType,
      amount: '' // Reset amount when category changes
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const config = categoryConfig[formData.category];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Log New Activity</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Category
            </label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>Transport</option>
              <option>Food</option>
              <option>Energy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.typeLabel}
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {typeOptions[formData.category].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.amountLabel}
            </label>
            <input
              type="number"
              placeholder={config.amountPlaceholder}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.dateLabel}
            </label>
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Calculate Carbon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogActivityForm;