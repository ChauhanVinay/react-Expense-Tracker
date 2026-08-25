import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; 

// Using the same API Key you used in Welcome.js
const API_KEY = "AIzaSyCONfqWrXYm2ZF4goNOeAzquBy-lidEx8U";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true); // Start loader

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      // Success
      setMessage("Password reset link sent! Please check your email inbox.");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loader regardless of success or failure
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleResetPassword}>
        <h2>Forgot Password</h2>
        <p style={{ marginBottom: '20px', fontSize: '14px', color: '#555' }}>
          Enter your registered email id to receive a password reset link.
        </p>

        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
           
        {/* Disable button and show loader text when loading */}
        <button type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? 'Sending Request...' : 'Send Link'}
        </button>
        
        <div className="signup-link" style={{ marginTop: '20px' }}>
          Remembered your password? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;