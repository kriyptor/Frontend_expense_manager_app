import React, { useState } from 'react';
import '../styles/AuthPage.css';

const AuthForm = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle authentication logic here (e.g., API call)
    console.log(isSignIn ? 'Sign-in submitted' : 'Sign-up submitted', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="auth-container">
     <div className="auth-inner">
     <div className="auth-toggle">
        <button 
          className={isSignIn ? 'active' : ''} 
          onClick={() => setIsSignIn(true)}
        >
          Sign In
        </button>
        <button 
          className={!isSignIn ? 'active' : ''} 
          onClick={() => setIsSignIn(false)}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!isSignIn && (
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required={!isSignIn}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
     </div>
    </div>
  );
};

export default AuthForm;