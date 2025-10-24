import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { currentUser, getUserActivities } = useAuth();
  const activities = getUserActivities();

  // Calculate today's emissions
  const getTodayEmissions = () => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(
      activity => new Date(activity.date).toDateString() === today
    );
    return todayActivities.reduce((sum, activity) => sum + (activity.co2 || 0), 0);
  };

  // Calculate weekly average
  const getWeeklyAverage = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekActivities = activities.filter(
      activity => new Date(activity.date) >= sevenDaysAgo
    );

    if (weekActivities.length === 0) return 0;

    const totalCO2 = weekActivities.reduce((sum, activity) => sum + (activity.co2 || 0), 0);
    
    // Get unique days with activities
    const uniqueDays = new Set(
      weekActivities.map(activity => new Date(activity.date).toDateString())
    );
    
    const activeDays = uniqueDays.size;
    return activeDays > 0 ? totalCO2 / activeDays : 0;
  };

  // Get active days count (days with at least one activity)
  const getActiveDays = () => {
    const uniqueDays = new Set(
      activities.map(activity => new Date(activity.date).toDateString())
    );
    return uniqueDays.size;
  };

  // Get weekly total emissions
  const getWeeklyTotal = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekActivities = activities.filter(
      activity => new Date(activity.date) >= sevenDaysAgo
    );

    return weekActivities.reduce((sum, activity) => sum + (activity.co2 || 0), 0);
  };

  // Get data for weekly chart
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date);
    }

    const data = last7Days.map(date => {
      const dateString = date.toDateString();
      const dayActivities = activities.filter(
        activity => new Date(activity.date).toDateString() === dateString
      );
      return dayActivities.reduce((sum, activity) => sum + (activity.co2 || 0), 0);
    });

    const labels = last7Days.map(date => days[date.getDay()]);

    return { labels, data };
  };

  const todayEmissions = getTodayEmissions();
  const weeklyAverage = getWeeklyAverage();
  const totalActivities = activities.length;
  const activeDays = getActiveDays();
  const weeklyTotal = getWeeklyTotal();
  const { labels, data } = getWeeklyData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily CO₂ Emissions (kg)',
        data,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(2)} kg CO₂`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {currentUser?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your carbon footprint overview
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Today's Emissions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Today's Emissions
              </p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {todayEmissions.toFixed(1)} kg
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                CO₂ emitted today
              </p>
            </div>
            <div className="text-5xl">🌍</div>
          </div>
        </div>

        {/* Weekly Average Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Weekly Average
              </p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {weeklyAverage.toFixed(1)} kg
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                per day
              </p>
            </div>
            <div className="text-5xl">📊</div>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Weekly Emissions Breakdown
        </h2>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Bottom Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Activities Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">
                Total Activities
              </p>
              <p className="text-4xl font-bold">
                {totalActivities}
              </p>
            </div>
            <div className="text-5xl opacity-80">📝</div>
          </div>
        </div>

        {/* Active Days Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">
                Active Days
              </p>
              <p className="text-4xl font-bold">
                {activeDays}
              </p>
            </div>
            <div className="text-5xl opacity-80">📅</div>
          </div>
        </div>

        {/* Weekly Total Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">
                Weekly Total
              </p>
              <p className="text-4xl font-bold">
                {weeklyTotal.toFixed(1)} kg
              </p>
            </div>
            <div className="text-5xl opacity-80">🌍</div>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      {activities.length === 0 && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                Get Started!
              </h3>
              <p className="text-blue-800 dark:text-blue-400 mb-3">
                Start tracking your daily activities to see your carbon footprint and get personalized tips.
              </p>
              <button
                onClick={() => window.location.href = '/track-activity'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add Your First Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;