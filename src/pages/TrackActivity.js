import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function TrackActivity() {
  const { addActivity, getUserActivities } = useAuth();
  const activities = getUserActivities();
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Transport');
  const [subcategory, setSubcategory] = useState('');
  const [amount, setAmount] = useState('');
  const [fuelType, setFuelType] = useState('petrol');
  const [flightType, setFlightType] = useState('domestic');
  const [duration, setDuration] = useState('');

  const categoryConfig = {
    Transport: {
      icon: '🚗',
      color: 'blue',
      subcategories: {
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
      subcategories: {
        'Electricity Use': { unit: 'kWh', factor: 0.50 },
        'LPG Cooking': { unit: 'kg', factor: 3.00 }
      }
    },
    Food: {
      icon: '🍽️',
      color: 'orange',
      subcategories: {
        Beef: { unit: 'kg', factor: 27.0 },
        Chicken: { unit: 'kg', factor: 6.9 },
        Vegetables: { unit: 'kg', factor: 2.0 },
        Dairy: { unit: 'litres', factor: 3.2 },
        Rice: { unit: 'kg', factor: 4.0 }
      }
    },
    'Electricity Generation': {
      icon: '⚡',
      color: 'yellow',
      subcategories: {
        Coal: { unit: 'kWh', factor: 0.820 },
        'Natural Gas': { unit: 'kWh', factor: 0.490 },
        Renewable: { unit: 'kWh', factor: 0.050 }
      }
    },
    'Burning Plastic': {
      icon: '🔥',
      color: 'red',
      subcategories: {
        'Plastic Waste': { unit: 'tonnes', factor: 6000, hasDuration: true }
      }
    }
  };

  const currentConfig = subcategory ? categoryConfig[category].subcategories[subcategory] : null;

  const calculateCO2 = () => {
    if (!currentConfig || !amount) return 0;

    let co2 = 0;
    const amountNum = parseFloat(amount);

    if (currentConfig.hasFuelType) {
      co2 = amountNum * currentConfig.factors[fuelType];
    } else if (currentConfig.hasFlightType) {
      co2 = amountNum * currentConfig.factors[flightType];
    } else if (currentConfig.hasDuration) {
      const durationNum = parseFloat(duration) || 1;
      co2 = amountNum * currentConfig.factor * durationNum;
    } else {
      co2 = amountNum * currentConfig.factor;
    }

    return co2;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const co2Value = calculateCO2();
    
    const activityData = {
      category,
      subcategory,
      amount: parseFloat(amount),
      unit: currentConfig.unit,
      co2: co2Value
    };

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
    
    setShowModal(false);
    setSubcategory('');
    setAmount('');
    setDuration('');
  };

  const todayActivities = activities.filter(activity => {
    const today = new Date().toDateString();
    const activityDate = new Date(activity.date).toDateString();
    return today === activityDate;
  });

  const todayTotal = todayActivities.reduce((sum, activity) => sum + activity.co2, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Track Activity</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors duration-200"
          >
            + Add Activity
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Impact</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{todayTotal.toFixed(2)} kg CO₂</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{todayActivities.length} activities recorded</p>
            </div>
            <div className="text-6xl">🌍</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activities</h2>
          
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No activities recorded yet</p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">Click "Add Activity" to start tracking!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{categoryConfig[activity.category].icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {activity.subcategory}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.amount} {activity.unit}
                        {activity.fuelType && ` (${activity.fuelType})`}
                        {activity.flightType && ` (${activity.flightType})`}
                        {activity.duration && ` - ${activity.duration} hours`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {activity.co2.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">kg CO₂</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Activity</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    {Object.keys(categoryConfig).map(cat => (
                      <option key={cat} value={cat}>
                        {categoryConfig[cat].icon} {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select subcategory</option>
                    {Object.keys(categoryConfig[category].subcategories).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {currentConfig && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount ({currentConfig.unit})
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    {currentConfig.hasFuelType && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Fuel Type
                        </label>
                        <select
                          value={fuelType}
                          onChange={(e) => setFuelType(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="petrol">Petrol</option>
                          <option value="diesel">Diesel</option>
                        </select>
                      </div>
                    )}

                    {currentConfig.hasFlightType && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Flight Type
                        </label>
                        <select
                          value={flightType}
                          onChange={(e) => setFlightType(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="domestic">Domestic</option>
                          <option value="international">International</option>
                        </select>
                      </div>
                    )}

                    {currentConfig.hasDuration && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration (hours)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    )}

                    {amount && (
                      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Estimated CO₂ Emissions:</p>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                          {calculateCO2().toFixed(2)} kg
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Add Activity
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackActivity;