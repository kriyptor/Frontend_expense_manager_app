import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import HomePage from "./components/Homepage";
import ExpenseManagerNavbar from "./components/Navbar";
import ExpenseReport from "./components/ExpenseReport";
import Leaderboard from "./components/Leaderboard";

const App = () => {
  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
  }, []);

  // Login handler
  const handleLogin = (userId) => {
    setUserId(userId);
    setIsAuthenticated(true);
    localStorage.setItem('userId', userId);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      {/* Navbar only shown when authenticated */}
      {isAuthenticated && <ExpenseManagerNavbar onLogout={handleLogout} />}
      
      <Routes>
        {/* Default route redirects based on authentication */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Auth handleLogin={handleLogin} />
          } 
        />
        
        {/* Protected Home Route */}
        <Route 
          path="/home" 
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/" />
          } 
        />
        
        {/* Protected Expense Report Route */}
        <Route 
          path="/report" 
          element={
            isAuthenticated ? <ExpenseReport /> : <Navigate to="/" />
          } 
        />

        {/* Protected Expense Report Route */}
        <Route 
          path="/leaderboard" 
          element={
            isAuthenticated ? <Leaderboard /> : <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;