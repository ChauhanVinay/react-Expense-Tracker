import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './Firebase'; 
import './Login.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/authSlice';
   
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

const  handleLogin = async (e) => {  
    e.preventDefault();
    setError('');

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //store the token
        const token = await userCredential.user.getIdToken();
        dispatch(authActions.login({
          token: token,
          userId: userCredential.user.uid
        }));

        window.location.href = "/welcome";
    } catch (err) {
        alert("login failed: " + err.message);
        setError(err.message);
    }
}
    return (
      <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <button type="submit">Login</button>
        
       <Link to="/forgot-password" className="forgot-link" style={{ display: 'block', margin: '15px 0' }}>
  Forgot password?
</Link>
        
        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </form>
    </div>
    );
};

export default Login;