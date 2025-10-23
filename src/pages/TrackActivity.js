import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function TrackActivity() {
  const { addActivity, getUserActivities } = useAuth();
  const activities = getUserActivities();
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Transport');
  const [subcategory, setSubcategory] = useState('Car');
  const [amount, setAmount] = useState('');
  const [fuelType, setFuelType] = useState('petrol');
  const [flightType, setFlightType] = useState('domestic');
  const [duration, setDuration] = useState('');

  // Category configurations with emission factors
  const categoryConfig = {
    Transport: {
      icon: '🚗',
      color: 'blue',
      subitems: {
        Car: { unit: 'km', factors: { petrol: 0.192, diesel: 0.171 }, hasFuelType: true },
        Motorbike: { unit: 'km', factor: 0.103 },
        Bus: { unit: 'km', factor: 0.105 },
        Train: { unit: 'km', factor: 0.041 },
        Airplane: { unit: 'km', factors: { domestic: 0.255, international: 0.195 }, hasFlightType: true }
      }
    },
    Household: {
      icon: '🏠',
      color: 'green',
      subitems: {
        'Electricity Use': { unit: 'kWh', factor: 0.50 },
        'LPG Cooking': { unit: 'kg', factor: 3.00 }
      }
    },
    Food: {
      icon: '🍽️',
      color: 'orange',
      subitems: {
        Beef: { unit: 'kg', factor: 27.0 },
        Chicken: { unit: 'kg', factor: 6.9 },
        Dairy: { unit: 'litres', factor: 3.2 },
        Vegetables: { unit: 'kg', factor: 2.0 },
        Rice: { unit: 'kg', factor: 4.0 }
      }
    },
    'Electricity Generation': {
      icon: '⚡',
      color: 'yellow',
      subitems: {
        Coal: { unit: 'kWh', factor: 0.820 },
        'Natural Gas': { unit: 'kWh', factor: 0.490 },
        Renewable: { unit: 'kWh', factor: 0.050 }
      }
    },
    'Burning Plastic': {
      icon: '🔥',
      color: 'red',
      subitems: {
        'Plastic Waste': { unit: 'tonnes', factor: 6000, hasDuration: true }
      }
    }
  };

  const currentConfig = categoryConfig[category]?.subitems[subcategory];

  // Calculate CO2 emissions
  const calculateCO2 = () => {
    if (!amount || !currentConfig) return 0;

    let co2 = 0;
    const amountNum = parseFloat(amount);

    if (currentConfig.hasFuelType) {
      // Car with fuel type
      co2 = amountNum * currentConfig.factors[fuelType];
    } else if (currentConfig.hasFlightType) {
      // Airplane with flight type
      co2 = amountNum * currentConfig.factors[flightType];
    } else if (currentConfig.hasDuration) {
      // Burning plastic with duration
      const durationNum = parseFloat(duration) || 1;
      co2 = amountNum * currentConfig.factor * durationNum;
    } else {
      // Standard calculation
      co2 = amountNum * currentConfig.factor;
    }

    return parseFloat(co2.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    if (currentConfig.hasDuration && !duration) {
      alert('Please enter duration');
      return;
    }

    const co2Value = calculateCO2();

    // Create activity object with proper structure
    const activityData = {
      category,
      subcategory,
      amount: parseFloat(amount),
      unit: currentConfig.unit,
      co2: co2Value // THIS IS THE KEY FIX - explicitly set co2 value
    };

    // Add optional fields
    if (currentConfig.hasFuelType) {
      activityData.fuelType = fuelType;
    }
    if (currentConfig.hasFlightType) {
      activityData.flightType = flightType;
    }
    if (currentConfig.hasDuration) {
      activityData.duration = parseFloat(duration);
    }

    addActivity(activityData);

    // Reset form
    setAmount('');
    setDuration('');
    setShowModal(false);
    setFuelType('petrol');
    setFlightType('domestic');
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    const firstSubitem = Object.keys(categoryConfig[newCategory].subitems)[0];
    setSubcategory(firstSubitem);
    setAmount('');
    setDuration('');
  };

  // Calculate today's total
  const todayActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date).toDateString();
    const today = new Date().toDateString();
    return activityDate === today;
  });

  const todayTotal = todayActivities.reduce((sum, activity) => sum + (activity.co2 || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Track Your Activities</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <span className="text-xl">+</span>
            Add Activity
          </button>
        </div>

        {/* Today's Impact Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg opacity-90 mb-2">Today's Impact</h3>
              <p className="text-5xl font-bold">{todayTotal.toFixed(2)} <span className="text-2xl">kg CO₂</span></p>
              <p className="text-sm opacity-90 mt-2">{todayActivities.length} activities recorded</p>
            </div>
            <div className="text-6xl opacity-80">🌍</div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          
          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-2">No activities yet</p>
              <p>Start tracking your carbon footprint by adding your first activity!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice().reverse().slice(0, 10).map((activity) => {
                const config = categoryConfig[activity.category];
                return (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl bg-${config.color}-100 p-3 rounded-lg`}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{activity.category}</h3>
                        <p className="text-sm text-gray-600">
                          {activity.subcategory} • {activity.amount} {activity.unit}
                          {activity.fuelType && ` • ${activity.fuelType}`}
                          {activity.flightType && ` • ${activity.flightType}`}
                          {activity.duration && ` • ${activity.duration} hrs`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-500">{activity.co2.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">kg CO₂</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Add New Activity</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(categoryConfig).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        category === cat
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{categoryConfig[cat].icon}</div>
                      <div className="text-xs font-medium text-gray-700">{cat}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {category} Type
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {Object.keys(categoryConfig[category].subitems).map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type (for Car) */}
              {currentConfig?.hasFuelType && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
              )}

              {/* Flight Type (for Airplane) */}
              {currentConfig?.hasFlightType && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Flight Type</label>
                  <select
                    value={flightType}
                    onChange={(e) => setFlightType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount ({currentConfig?.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter ${currentConfig?.unit}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Duration (for Burning Plastic) */}
              {currentConfig?.hasDuration && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Enter hours"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* CO2 Preview */}
              {amount && (!currentConfig?.hasDuration || duration) && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Estimated CO₂ Emissions:</p>
                  <p className="text-3xl font-bold text-red-600">
                    {calculateCO2().toFixed(2)} <span className="text-lg">kg CO₂</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackActivity;