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
  Legend,
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
  const { getTodayEmissions, getWeeklyAverage, getWeeklyData } = useAuth();

  const todayEmissions = getTodayEmissions();
  const weeklyAverage = getWeeklyAverage();
  const weeklyData = getWeeklyData();

  const chartData = {
    labels: weeklyData.map(d => d.day),
    datasets: [
      {
        label: 'CO₂ Emissions (kg)',
        data: weeklyData.map(d => d.emissions),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Weekly Emissions Breakdown',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#1f2937',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Today's Emissions
            </h3>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              {todayEmissions.toFixed(1)} kg
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">CO₂ emitted today</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Weekly Average
            </h3>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {weeklyAverage.toFixed(1)} kg
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">per day</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Activities</p>
                <p className="text-3xl font-bold mt-2">
                  {weeklyData.reduce((sum, d) => sum + d.count, 0)}
                </p>
              </div>
              <div className="text-4xl opacity-80">📊</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Days</p>
                <p className="text-3xl font-bold mt-2">
                  {weeklyData.filter(d => d.count > 0).length}
                </p>
              </div>
              <div className="text-4xl opacity-80">📅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Weekly Total</p>
                <p className="text-3xl font-bold mt-2">
                  {weeklyData.reduce((sum, d) => sum + d.emissions, 0).toFixed(1)} kg
                </p>
              </div>
              <div className="text-4xl opacity-80">🌍</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;