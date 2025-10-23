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

// Register Chart.js components
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
  const today = new Date().toDateString();
  const todayActivities = activities.filter(
    activity => new Date(activity.date).toDateString() === today
  );
  const todayEmissions = todayActivities.reduce((sum, activity) => sum + activity.co2, 0);

  // Calculate weekly average (last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toDateString());
  }

  const weeklyData = last7Days.map(dateStr => {
    const dayActivities = activities.filter(
      activity => new Date(activity.date).toDateString() === dateStr
    );
    return dayActivities.reduce((sum, activity) => sum + activity.co2, 0);
  });

  const weeklyAverage = weeklyData.length > 0 
    ? (weeklyData.reduce((sum, val) => sum + val, 0) / weeklyData.length).toFixed(1)
    : 0;

  // Chart data
  const chartData = {
    labels: last7Days.map(dateStr => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Daily Emissions (kg CO₂)',
        data: weeklyData,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
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
        display: true,
        text: 'Weekly Emissions Breakdown',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' kg';
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {currentUser?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's your carbon footprint overview</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Today's Emissions */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Emissions</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {todayEmissions.toFixed(1)}
                  <span className="text-xl text-gray-600 ml-2">kg CO₂</span>
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <span className="text-3xl">🌍</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {todayActivities.length} {todayActivities.length === 1 ? 'activity' : 'activities'} recorded today
            </p>
          </div>

          {/* Weekly Average */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Weekly Average</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {weeklyAverage}
                  <span className="text-xl text-gray-600 ml-2">kg/day</span>
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <span className="text-3xl">📊</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Last 7 days average emissions
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div style={{ height: '300px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Total Activities</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{activities.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">This Week's Total</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {weeklyData.reduce((sum, val) => sum + val, 0).toFixed(1)} kg
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Average per Activity</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {activities.length > 0 
                  ? (activities.reduce((sum, a) => sum + a.co2, 0) / activities.length).toFixed(1)
                  : 0} kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;