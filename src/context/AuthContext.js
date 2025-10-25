import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const signup = (name, email, password) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'User already exists with this email' };
    }

    const newUser = {
      name,
      email,
      password,
      activities: [],
      badges: [],
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    return { success: true, message: 'Signup successful! Redirecting to login...' };
  };

  const login = (email, password) => {
    // First check if user exists
    const userExists = users.find(u => u.email === email);
    
    if (!userExists) {
      return { 
        success: false, 
        message: 'User not registered. Please sign up first.',
        userNotFound: true 
      };
    }

    // Then check password
    if (userExists.password !== password) {
      return { 
        success: false, 
        message: 'Incorrect password. Please try again.',
        userNotFound: false 
      };
    }

    // Login successful
    setCurrentUser(userExists);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addActivity = (activity) => {
    if (!currentUser) return;

    const activityWithDate = {
      ...activity,
      date: new Date().toISOString(),
      id: Date.now()
    };

    const updatedActivities = [...(currentUser.activities || []), activityWithDate];
    const updatedUser = { ...currentUser, activities: updatedActivities };

    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.email === currentUser.email ? updatedUser : u));
  };

  const getUserActivities = () => {
    return currentUser?.activities || [];
  };

  const getTodayEmissions = () => {
    if (!currentUser) return 0;
    const today = new Date().toDateString();
    const todayActivities = currentUser.activities?.filter(
      activity => new Date(activity.date).toDateString() === today
    ) || [];
    return todayActivities.reduce((sum, activity) => sum + (activity.co2 || 0), 0);
  };

  const getWeeklyAverage = () => {
    if (!currentUser) return 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekActivities = currentUser.activities?.filter(
      activity => new Date(activity.date) >= sevenDaysAgo
    ) || [];

    if (weekActivities.length === 0) return 0;

    const totalCO2 = weekActivities.reduce((sum, activity) => sum + (activity.co2 || 0), 0);
    const uniqueDays = new Set(
      weekActivities.map(activity => new Date(activity.date).toDateString())
    );
    const activeDays = uniqueDays.size;
    return activeDays > 0 ? totalCO2 / activeDays : 0;
  };

  const getWeeklyData = () => {
    if (!currentUser) return { labels: [], data: [] };
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
      const dayActivities = currentUser.activities?.filter(
        activity => new Date(activity.date).toDateString() === dateString
      ) || [];
      return dayActivities.reduce((sum, activity) => sum + (activity.co2 || 0), 0);
    });

    const labels = last7Days.map(date => days[date.getDay()]);
    return { labels, data };
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    addActivity,
    getUserActivities,
    getTodayEmissions,
    getWeeklyAverage,
    getWeeklyData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}