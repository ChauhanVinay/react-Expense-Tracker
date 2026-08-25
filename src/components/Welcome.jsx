import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { auth } from './Firebase';
import ExpenseForm from './ExpenseForm';
import {  useDispatch } from 'react-redux';
import { authActions } from "../store/authSlice";

const API_KEY = "AIzaSyCONfqWrXYm2ZF4goNOeAzquBy-lidEx8U"; 

const Welcome = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // This listens for the user to load, then logs their verification status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Is Email Verified?:", user.emailVerified);
      }
    });
    
    return () => unsubscribe(); // Cleanup listener
  }, []);

  //Logout function
  const handleLogout = () => {
    //Clear the token from local storage
    dispatch(authActions.logout());
    auth.signOut();
    //Redirect to login page
    navigate('/login');
  }

  const handleVerifyEmail = async () => {
    setMessage('');
    setError('');
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      setMessage("Verification link sent! Please check your email inbox.");
      alert("Verification link sent to your email!");
      
    } catch (err) {
      setError(err.message);
      alert("Error sending verification email: " + err.message);
    }
  };

  const goToUpdateProfile = () => {
    navigate('/update-profile');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px 30px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#dc3545', // Red color for logout
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Logout
        </button>
      </header>


    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to Expense Tracker</h1>
      
      <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        
        <button 
          onClick={handleVerifyEmail}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Verify Email ID
        </button>

        <button 
          onClick={goToUpdateProfile}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Complete Profile
        </button>
      </div>

      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
    </div>
    <ExpenseForm />
    </div>
  );
};

export default Welcome;