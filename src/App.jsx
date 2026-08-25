import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Welcome from './components/Welcome';
import SignUp from './components/SignUp';
import UpdateProfile from './components/UpdateProfile'; 
import ForgotPassword from './components/ForgotPassword';
  
function App() {

  const isDarkTheme = useSelector((state) => state.theme.isDarkTheme);

  //Apply dark theme to the global body
  useEffect(() => {
    if(isDarkTheme) {
    document.body.style.backgroundColor = "#222";
    document.body.style.color = "#fff";
    } else {
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
    }
  }, [isDarkTheme]);

  return (
    <Router>
      <Routes>
   <Route path="/signup" element={<SignUp />} />
   <Route path="/login" element={<Login />} />
   <Route path="/welcome" element={<Welcome />} />
    <Route path="/update-profile" element={<UpdateProfile />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
   {/* Redirect default path to Login */}
   <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
