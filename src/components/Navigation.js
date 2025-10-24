import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

function Navigation() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b-4 border-green-500 dark:border-green-600 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive('/dashboard')
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">📊</span>
              Dashboard
            </Link>
            
            <Link
              to="/track-activity"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive('/track-activity')
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">📝</span>
              Track Activity
            </Link>
            
            <Link
              to="/eco-tips"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive('/eco-tips')
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">💡</span>
              Eco Tips
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {currentUser?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="md:hidden pb-4 flex gap-2">
          <Link
            to="/dashboard"
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium text-center ${
              isActive('/dashboard')
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="text-lg mb-1">📊</div>
            Dashboard
          </Link>
          
          <Link
            to="/track-activity"
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium text-center ${
              isActive('/track-activity')
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="text-lg mb-1">📝</div>
            Track
          </Link>
          
          <Link
            to="/eco-tips"
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium text-center ${
              isActive('/eco-tips')
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="text-lg mb-1">💡</div>
            Tips
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;