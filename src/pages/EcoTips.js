import React from 'react';

function EcoTips() {
  const tips = [
    {
      id: 1,
      category: 'Transport',
      icon: '🚌',
      title: 'Use Public Transport',
      description: 'Switch from personal vehicles to public transport to significantly reduce your carbon footprint.',
      impact: '45.5 kg CO₂/month',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    {
      id: 2,
      category: 'Energy',
      icon: '💡',
      title: 'Switch to LED Bulbs',
      description: 'Replace all incandescent bulbs with LED bulbs to save energy and reduce emissions.',
      impact: '12.3 kg CO₂/month',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-700 dark:text-yellow-300'
    },
    {
      id: 3,
      category: 'Food',
      icon: '🥗',
      title: 'Reduce Meat Consumption',
      description: 'Try plant-based meals 2-3 times a week. Red meat production has high carbon emissions.',
      impact: '28.7 kg CO₂/month',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-700 dark:text-green-300'
    },
    {
      id: 4,
      category: 'Energy',
      icon: '🔌',
      title: 'Unplug Electronics',
      description: 'Unplug devices when not in use. Standby power accounts for 5-10% of home energy use.',
      impact: '8.9 kg CO₂/month',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-700 dark:text-orange-300'
    },
    {
      id: 5,
      category: 'Water',
      icon: '💧',
      title: 'Take Shorter Showers',
      description: 'Reduce shower time by 2-3 minutes to save water and the energy used to heat it.',
      impact: '6.5 kg CO₂/month',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      borderColor: 'border-cyan-200 dark:border-cyan-800',
      textColor: 'text-cyan-700 dark:text-cyan-300'
    },
    {
      id: 6,
      category: 'Waste',
      icon: '♻️',
      title: 'Recycle Properly',
      description: 'Sort and recycle paper, plastic, glass, and metal to reduce landfill waste.',
      impact: '11.2 kg CO₂/month',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-700 dark:text-purple-300'
    }
  ];

  const totalImpact = tips.reduce((sum, tip) => {
    return sum + parseFloat(tip.impact.split(' ')[0]);
  }, 0);

  const quickActions = [
    { action: 'Walk or Bike', savings: '2.3 kg CO₂', icon: '🚶' },
    { action: 'LED Bulbs', savings: '0.4 kg CO₂', icon: '💡' },
    { action: 'Plant-Based Meal', savings: '1.8 kg CO₂', icon: '🥗' },
    { action: 'Unplug Devices', savings: '0.3 kg CO₂', icon: '🔌' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🌱 Eco-Friendly Tips
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Small changes make a big difference. Here are actionable tips to reduce your carbon footprint.
          </p>
        </div>

        {/* Total Impact Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90 mb-1">Potential Monthly Impact</p>
              <p className="text-4xl font-bold">{totalImpact.toFixed(1)} kg CO₂</p>
              <p className="text-sm opacity-90 mt-1">saved by following all tips</p>
            </div>
            <div className="text-6xl">
              🌍
            </div>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`${tip.bgColor} ${tip.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{tip.icon}</div>
                <span className={`${tip.textColor} text-xs font-semibold px-3 py-1 bg-white dark:bg-gray-800 rounded-full`}>
                  {tip.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {tip.title}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {tip.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`${tip.textColor} font-bold text-lg`}>
                  {tip.impact}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  saved
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-colors duration-200">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ⚡ Quick Actions for Today
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {action.action}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-bold">
                  Save {action.savings}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💚</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Every Action Counts!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Start with one tip today and gradually incorporate more eco-friendly habits into your daily routine.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EcoTips;