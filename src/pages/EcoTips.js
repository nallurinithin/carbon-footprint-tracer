import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

function EcoTips() {
  const { getUserActivities } = useAuth();
  const activities = getUserActivities();

  // All available tips with category targeting
  const allTips = useMemo(() => [
    {
      id: 1,
      category: 'Transport',
      relevantFor: ['Car', 'Motorbike'],
      title: 'Use Public Transport',
      description: 'Switch from personal vehicles to buses or trains to significantly reduce your carbon footprint.',
      impact: 45.5,
      icon: '🚌',
      priority: 'high'
    },
    {
      id: 2,
      category: 'Transport',
      relevantFor: ['Car'],
      title: 'Carpool or Bike to Work',
      description: 'Share rides with colleagues or cycle for short distances to cut emissions.',
      impact: 38.2,
      icon: '🚴',
      priority: 'high'
    },
    {
      id: 3,
      category: 'Household',
      relevantFor: ['Electricity_Use'],
      title: 'Switch to LED Bulbs',
      description: 'LED bulbs use 75% less energy than traditional bulbs and last much longer.',
      impact: 12.3,
      icon: '💡',
      priority: 'medium'
    },
    {
      id: 4,
      category: 'Household',
      relevantFor: ['Electricity_Use', 'LPG_Cooking'],
      title: 'Unplug Electronics When Not in Use',
      description: 'Phantom power from plugged-in devices can account for 10% of your electricity bill.',
      impact: 8.9,
      icon: '🔌',
      priority: 'medium'
    },
    {
      id: 5,
      category: 'Food',
      relevantFor: ['Beef', 'Chicken'],
      title: 'Reduce Meat Consumption',
      description: 'Try meatless Mondays or plant-based alternatives to lower your food carbon footprint.',
      impact: 28.7,
      icon: '🥗',
      priority: 'high'
    },
    {
      id: 6,
      category: 'Food',
      relevantFor: ['Beef'],
      title: 'Choose Locally Sourced Food',
      description: 'Buying local reduces transportation emissions from food miles.',
      impact: 15.4,
      icon: '🌾',
      priority: 'medium'
    },
    {
      id: 7,
      category: 'Electricity_Generation',
      relevantFor: ['Coal', 'Oil'],
      title: 'Switch to Renewable Energy',
      description: 'Consider solar panels or renewable energy plans from your utility provider.',
      impact: 52.1,
      icon: '☀️',
      priority: 'high'
    },
    {
      id: 8,
      category: 'Burning_Plastic',
      relevantFor: ['Plastic_Waste'],
      title: 'Stop Burning Plastic Waste',
      description: 'Burning plastic releases toxic fumes and CO₂. Use proper waste disposal or recycling instead.',
      impact: 65.0,
      icon: '🚫',
      priority: 'critical'
    },
    {
      id: 9,
      category: 'General',
      relevantFor: [],
      title: 'Reduce, Reuse, Recycle',
      description: 'Follow the 3 Rs to minimize waste and conserve resources.',
      impact: 18.5,
      icon: '♻️',
      priority: 'medium'
    },
    {
      id: 10,
      category: 'General',
      relevantFor: [],
      title: 'Plant Trees',
      description: 'Trees absorb CO₂ from the atmosphere. Even a small garden helps!',
      impact: 22.0,
      icon: '🌳',
      priority: 'medium'
    }
  ], []);

  // Analyze user's activities to determine personalized tips
  const activityAnalysis = useMemo(() => {
    const categoryCount = {};
    const subcategoryCount = {};
    let totalCO2 = 0;

    activities.forEach(activity => {
      // Count by category
      categoryCount[activity.category] = (categoryCount[activity.category] || 0) + 1;
      
      // Count by subcategory
      subcategoryCount[activity.subcategory] = (subcategoryCount[activity.subcategory] || 0) + 1;
      
      // Total CO2
      totalCO2 += activity.co2 || 0;
    });

    // Get top 3 categories by count
    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    return {
      topCategories,
      subcategoryCount,
      totalCO2,
      activityCount: activities.length
    };
  }, [activities]);

  // Generate personalized tips based on user's activities
  const personalizedTips = useMemo(() => {
    if (activities.length === 0) {
      // Return default high-impact tips for new users
      return allTips
        .filter(tip => tip.priority === 'high' || tip.priority === 'critical')
        .slice(0, 6);
    }

    const { topCategories, subcategoryCount } = activityAnalysis;

    // Score each tip based on relevance
    const scoredTips = allTips.map(tip => {
      let score = 0;

      // High score if tip's category matches user's top categories
      if (topCategories.includes(tip.category)) {
        score += 10;
      }

      // Higher score if tip targets specific subcategories user uses
      tip.relevantFor.forEach(subcategory => {
        if (subcategoryCount[subcategory]) {
          score += subcategoryCount[subcategory] * 5;
        }
      });

      // Priority bonus
      if (tip.priority === 'critical') score += 15;
      if (tip.priority === 'high') score += 10;
      if (tip.priority === 'medium') score += 5;

      // Impact bonus
      score += tip.impact / 10;

      return { ...tip, score, personalized: score > 10 };
    });

    // Sort by score and get top 6
    const relevantTips = scoredTips
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    // Add 2 general tips
    const generalTips = allTips
      .filter(tip => tip.category === 'General')
      .slice(0, 2);

    return [...relevantTips, ...generalTips];
  }, [activities.length, activityAnalysis, allTips]);

  const totalImpact = personalizedTips.reduce((sum, tip) => sum + tip.impact, 0);

  const getCategoryColor = (category) => {
    const colors = {
      'Transport': {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-400',
        badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
      },
      'Household': {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-400',
        badge: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
      },
      'Food': {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-400',
        badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300'
      },
      'Electricity_Generation': {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-700 dark:text-yellow-400',
        badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
      },
      'Burning_Plastic': {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-400',
        badge: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
      },
      'General': {
        bg: 'bg-gray-50 dark:bg-gray-800',
        border: 'border-gray-200 dark:border-gray-700',
        text: 'text-gray-700 dark:text-gray-300',
        badge: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      }
    };
    return colors[category] || colors['General'];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Eco-Friendly Tips
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {activities.length > 0 
            ? 'Personalized recommendations based on your activities' 
            : 'Get started with these high-impact actions'}
        </p>
      </div>

      {/* Potential Impact Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium mb-1">Potential Monthly Impact</p>
            <p className="text-white text-4xl font-bold">{totalImpact.toFixed(1)} kg CO₂</p>
            <p className="text-green-100 text-sm mt-1">saved by following these tips</p>
          </div>
          <div className="text-6xl">💚</div>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personalizedTips.map((tip) => {
          const colors = getCategoryColor(tip.category);
          return (
            <div
              key={tip.id}
              className={`${colors.bg} ${colors.border} border-2 rounded-lg p-6 transition-all duration-200 hover:shadow-lg ${
                tip.personalized ? 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900' : ''
              }`}
            >
              {/* Personalized Badge */}
              {tip.personalized && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                    🎯 Recommended for you
                  </span>
                </div>
              )}

              {/* Icon and Title */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-4xl">{tip.icon}</span>
                <div>
                  <h3 className={`text-lg font-semibold ${colors.text} mb-1`}>
                    {tip.title}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.badge}`}>
                    {tip.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                {tip.description}
              </p>

              {/* Impact */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Monthly Savings
                </span>
                <span className={`text-lg font-bold ${colors.text}`}>
                  {tip.impact.toFixed(1)} kg CO₂
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      {activities.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions for Today
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
              <div className="text-2xl mb-2">🚶</div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Walk or Bike</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Save 2.3 kg CO₂</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">LED Bulbs</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Save 0.4 kg CO₂</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-orange-200 dark:border-orange-800">
              <div className="text-2xl mb-2">🥗</div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Plant-Based Meal</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Save 1.8 kg CO₂</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-yellow-200 dark:border-yellow-800">
              <div className="text-2xl mb-2">🔌</div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Unplug Devices</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Save 0.3 kg CO₂</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EcoTips;