import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Auth from "./components/Auth";
import HomePage from "./components/Homepage";
import ExpenseManagerNavbar from "./components/Navbar";
import ExpenseReport from "./components/ExpenseReport";
import Leaderboard from "./components/Leaderboard";
import axios from 'axios'; // Add this at the top

const App = () => {
  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserPremiumStatus = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/user/premium-user/${userId}`);

      setIsPremium(response.data.userIsPremium);
    } catch (error) {
      console.error("Error fetching user premium status:", error);
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          await fetchUserPremiumStatus(storedUserId);
          setUserId(storedUserId);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);

  // Login handler
  const handleLogin = async (userId) => {
    try {
      await fetchUserPremiumStatus(userId);
      setUserId(userId);
      setIsAuthenticated(true);
      localStorage.setItem('userId', userId);
    } catch (error) {
      console.error("Login error:", error);
      // Add proper error handling here
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('userId');
  };

  if (isLoading) {
    return <Spinner animation="border" /> // Or a proper loading component
  }

  return (
    <Router>
      {/* Navbar only shown when authenticated */}
      {isAuthenticated && 
        <ExpenseManagerNavbar 
          onLogout={handleLogout} 
          isPremium={isPremium} 
          setIsPremium={setIsPremium}
          userId={userId} // Add userId if needed in navbar
        />
      }
      
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
            isAuthenticated ? <ExpenseReport isPremium={isPremium} /> : <Navigate to="/" />
          } 
        />

        {/* Protected Leaderboard Route */}
        <Route 
          path="/leaderboard" 
          element={
            isAuthenticated ? <Leaderboard /> : <Navigate to="/" />
          } 
        />

        {/* 404 Route */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;