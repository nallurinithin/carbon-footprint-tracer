import React from 'react';

const EcoTips = () => {
  const tips = [
    {
      id: 1,
      title: 'Use Public Transport',
      description: 'Switch from personal vehicles to buses, trains, or metro to significantly reduce your carbon footprint.',
      impact: '45.5 kg CO₂/month',
      category: 'Transport',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 2,
      title: 'Switch to LED Bulbs',
      description: 'LED bulbs use 75% less energy and last 25 times longer than traditional incandescent bulbs.',
      impact: '12.3 kg CO₂/month',
      category: 'Energy',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 3,
      title: 'Reduce Meat Consumption',
      description: 'Eating more plant-based meals reduces emissions from livestock farming and land use.',
      impact: '28.7 kg CO₂/month',
      category: 'Food',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 4,
      title: 'Unplug Electronics',
      description: 'Devices consume energy even when turned off. Unplug chargers and appliances when not in use.',
      impact: '8.9 kg CO₂/month',
      category: 'Energy',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 5,
      title: 'Use Reusable Bags',
      description: 'Plastic bags take hundreds of years to decompose. Carry reusable bags for shopping.',
      impact: '5.2 kg CO₂/month',
      category: 'Waste',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 6,
      title: 'Save Water',
      description: 'Fix leaks, take shorter showers, and use water-efficient fixtures to conserve water and energy.',
      impact: '7.4 kg CO₂/month',
      category: 'Water',
      color: 'bg-cyan-100 text-cyan-800'
    }
  ];

  const totalImpact = tips.reduce((sum, tip) => {
    return sum + parseFloat(tip.impact.split(' ')[0]);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Eco-Friendly Tips</h1>
          <p className="text-gray-600">Simple actions to reduce your carbon footprint</p>
        </div>

        {/* Potential Impact Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Potential Monthly Impact</p>
              <h2 className="text-4xl font-bold">{totalImpact.toFixed(1)} kg CO₂</h2>
              <p className="text-green-100 text-sm mt-2">saved by following all tips</p>
            </div>
            <div className="hidden sm:block">
              <svg className="w-20 h-20 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div key={tip.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{tip.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${tip.color}`}>
                    {tip.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {tip.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-lg font-bold text-green-600">{tip.impact}</span>
                  </div>
                  <span className="text-xs text-gray-500">per month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions for Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                🚶
              </div>
              <div>
                <p className="font-semibold text-gray-800">Walk or Bike</p>
                <p className="text-sm text-gray-600">Save 2.3 kg CO₂</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                💡
              </div>
              <div>
                <p className="font-semibold text-gray-800">LED Bulbs</p>
                <p className="text-sm text-gray-600">Save 0.4 kg CO₂</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                🥗
              </div>
              <div>
                <p className="font-semibold text-gray-800">Plant-Based Meal</p>
                <p className="text-sm text-gray-600">Save 1.8 kg CO₂</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                🔌
              </div>
              <div>
                <p className="font-semibold text-gray-800">Unplug Devices</p>
                <p className="text-sm text-gray-600">Save 0.3 kg CO₂</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoTips;