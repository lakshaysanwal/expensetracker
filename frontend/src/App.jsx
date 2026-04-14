import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [theme, setTheme] = useState('light');
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
