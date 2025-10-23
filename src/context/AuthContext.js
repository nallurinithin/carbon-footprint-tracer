import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState({});

  const signup = (name, email, password) => {
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    return { success: true, message: 'Signup successful!' };
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: "User doesn't exist. Please signup first." };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addActivity = (activityData) => {
    if (!currentUser) return;

    const newActivity = {
      id: Date.now().toString(),
      userId: currentUser.id,
      ...activityData,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    setActivities(prev => ({
      ...prev,
      [currentUser.id]: [...(prev[currentUser.id] || []), newActivity]
    }));
  };

  const getUserActivities = () => {
    if (!currentUser) return [];
    return activities[currentUser.id] || [];
  };

  const getTodayActivities = () => {
    const userActivities = getUserActivities();
    const today = new Date().toDateString();
    return userActivities.filter(activity => {
      const activityDate = new Date(activity.date).toDateString();
      return activityDate === today;
    });
  };

  const getTodayEmissions = () => {
    const todayActivities = getTodayActivities();
    return todayActivities.reduce((total, activity) => {
      return total + (activity.co2 || 0);
    }, 0);
  };

  const getWeeklyAverage = () => {
    const userActivities = getUserActivities();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const weekActivities = userActivities.filter(activity => 
      activity.timestamp >= sevenDaysAgo
    );

    if (weekActivities.length === 0) return 0;

    const totalEmissions = weekActivities.reduce((total, activity) => {
      return total + (activity.co2 || 0);
    }, 0);

    // Get unique days
    const uniqueDays = new Set(
      weekActivities.map(activity => 
        new Date(activity.date).toDateString()
      )
    );

    return totalEmissions / uniqueDays.size;
  };

  const getWeeklyData = () => {
    const userActivities = getUserActivities();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const dayName = days[date.getDay()];

      const dayActivities = userActivities.filter(activity => {
        const activityDate = new Date(activity.date).toDateString();
        return activityDate === dateString;
      });

      const totalEmissions = dayActivities.reduce((total, activity) => {
        return total + (activity.co2 || 0);
      }, 0);

      weekData.push({
        day: dayName,
        emissions: parseFloat(totalEmissions.toFixed(2))
      });
    }

    return weekData;
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    addActivity,
    getUserActivities,
    getTodayActivities,
    getTodayEmissions,
    getWeeklyAverage,
    getWeeklyData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};