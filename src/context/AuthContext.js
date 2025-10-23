import React, { createContext, useState, useContext } from 'react';

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
  const [activities, setActivities] = useState([]);

  const signup = (name, email, password) => {
    // Check if user already exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return { success: false, message: 'User already exists with this email' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed!
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    return { success: true, message: 'Signup successful! Please login.' };
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'User does not exist. Please signup first.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    setCurrentUser(user);
    return { success: true, message: 'Login successful!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      userId: currentUser.id,
      date: new Date().toISOString()
    };
    setActivities([newActivity, ...activities]);
    return newActivity;
  };

  const getUserActivities = () => {
    return activities.filter(a => a.userId === currentUser?.id);
  };

  const getTodayActivities = () => {
    const today = new Date().toDateString();
    return getUserActivities().filter(a => 
      new Date(a.date).toDateString() === today
    );
  };

  const value = {
    currentUser,
    users,
    activities,
    signup,
    login,
    logout,
    addActivity,
    getUserActivities,
    getTodayActivities
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};