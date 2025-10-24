import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const signup = (name, email, password) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      activities: [],
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    return newUser;
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addActivity = (activityData) => {
    if (!currentUser) return;

    const newActivity = {
      id: Date.now().toString(),
      ...activityData,
      date: new Date().toISOString(),
      userId: currentUser.id
    };

    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          activities: [...(user.activities || []), newActivity]
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    
    const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
    setCurrentUser(updatedCurrentUser);
  };

  const getUserActivities = () => {
    if (!currentUser) return [];
    const user = users.find(u => u.id === currentUser.id);
    return user?.activities || [];
  };

  const getTodayEmissions = () => {
    const activities = getUserActivities();
    const today = new Date().toDateString();
    
    const todayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date).toDateString();
      return activityDate === today;
    });

    return todayActivities.reduce((total, activity) => {
      return total + (parseFloat(activity.co2) || 0);
    }, 0);
  };

  const getWeeklyAverage = () => {
    const activities = getUserActivities();
    if (activities.length === 0) return 0;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= weekAgo && activityDate <= now;
    });

    if (weekActivities.length === 0) return 0;

    const totalCO2 = weekActivities.reduce((total, activity) => {
      return total + (parseFloat(activity.co2) || 0);
    }, 0);

    const uniqueDays = new Set(
      weekActivities.map(activity => new Date(activity.date).toDateString())
    );

    return totalCO2 / uniqueDays.size;
  };

  const getWeeklyData = () => {
    const activities = getUserActivities();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayActivities = activities.filter(activity => {
        return new Date(activity.date).toDateString() === dateStr;
      });

      const totalCO2 = dayActivities.reduce((total, activity) => {
        return total + (parseFloat(activity.co2) || 0);
      }, 0);

      data.push({
        day: days[date.getDay()],
        emissions: parseFloat(totalCO2.toFixed(2))
      });
    }

    return data;
  };

  // NEW: Activity Analysis Function for Personalized Tips
  const analyzeUserActivities = () => {
    const activities = getUserActivities();
    
    if (activities.length === 0) {
      return {
        hasActivities: false,
        topCategories: [],
        categoryBreakdown: {},
        totalCO2: 0,
        activityCount: 0
      };
    }

    const categoryBreakdown = {};
    let totalCO2 = 0;

    activities.forEach(activity => {
      const category = activity.category || 'Other';
      const co2 = parseFloat(activity.co2) || 0;
      
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = 0;
      }
      categoryBreakdown[category] += co2;
      totalCO2 += co2;
    });

    const sortedCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .map(([category, emissions]) => ({
        category,
        emissions: parseFloat(emissions.toFixed(2)),
        percentage: ((emissions / totalCO2) * 100).toFixed(1)
      }));

    return {
      hasActivities: true,
      topCategories: sortedCategories.slice(0, 3).map(c => c.category),
      categoryBreakdown: Object.fromEntries(
        sortedCategories.map(c => [c.category, c.emissions])
      ),
      totalCO2: parseFloat(totalCO2.toFixed(2)),
      activityCount: activities.length,
      sortedCategories
    };
  };

  const value = {
    currentUser,
    users,
    signup,
    login,
    logout,
    addActivity,
    getUserActivities,
    getTodayEmissions,
    getWeeklyAverage,
    getWeeklyData,
    analyzeUserActivities
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}