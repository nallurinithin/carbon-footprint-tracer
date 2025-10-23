import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function TrackActivity() {
  const { addActivity, getUserActivities } = useAuth();
  const activities = getUserActivities();
  
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Transport');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('km');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Calculate CO2 based on category
    let co2 = 0;
    
    if (category === 'Transport') {
      co2 = parseFloat(amount) * 0.21; // Default car emission
    } else if (category === 'Electricity') {
      co2 = parseFloat(amount) * 0.82;
    } else if (category === 'Food') {
      co2 = parseFloat(amount) * 13.5; // Average food emission
    }

    const newActivity = {
      category,
      amount: parseFloat(amount),
      unit,
      co2: parseFloat(co2.toFixed(2)),
      date: new Date().toISOString()
    };

    addActivity(newActivity);
    
    // Reset form
    setAmount('');
    setShowModal(false);
  };

  // Calculate today's impact
  const today = new Date().toDateString();
  const todayActivities = activities.filter(
    activity => new Date(activity.date).toDateString() === today
  );
  const todayTotal = todayActivities.reduce((sum, activity) => sum + activity.co2, 0);

  // Get category icon
  const getCategoryIcon = (cat) => {
    const icons = {
      Transport: '🚗',
      Electricity: '⚡',
      Food: '🍽️'
    };
    return icons[cat] || '📊';
  };

  // Get category color
  const getCategoryColor = (cat) => {
    const colors = {
      Transport: 'bg-red-100 text-red-600',
      Electricity: 'bg-yellow-100 text-yellow-600',
      Food: 'bg-green-100 text-green-600'
    };
    return colors[cat] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Track Activity</h1>
            <p className="text-gray-600 mt-2">Record your daily carbon footprint</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Activity
          </button>
        </div>

        {/* Today's Impact */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 text-white mb-8">
          <h2 className="text-lg font-semibold mb-2">Today's Impact</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{todayTotal.toFixed(1)}</span>
            <span className="text-2xl">kg CO₂</span>
          </div>
          <p className="mt-2 text-green-100">
            {todayActivities.length} {todayActivities.length === 1 ? 'activity' : 'activities'} recorded today
          </p>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📊</span>
              <p className="text-gray-500 text-lg">No activities recorded yet</p>
              <p className="text-gray-400 mt-2">Click "Add Activity" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.slice().reverse().slice(0, 10).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getCategoryColor(activity.category)}`}>
                      {getCategoryIcon(activity.category)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{activity.category}</p>
                      <p className="text-sm text-gray-600">
                        {activity.amount} {activity.unit}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{activity.co2.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">kg CO₂</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Activity</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    // Update unit based on category
                    if (e.target.value === 'Transport') setUnit('km');
                    if (e.target.value === 'Electricity') setUnit('kWh');
                    if (e.target.value === 'Food') setUnit('kg');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Transport">Transport</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Food">Food</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                    setAmount('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                >
                  Add Activity
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