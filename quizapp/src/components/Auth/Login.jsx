import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
  
      if (response.status === 200) {
        // Handle successful login, e.g., save token, redirect, etc.
        console.log('Login successful:', response.data);
        const token = response.headers['auth-token'];
        if (token) {
          localStorage.setItem('auth-token', token);
          console.log('Token stored:');  // Debugging output
          navigate('/Dashboard');
        
        } else {
          console.log('No token received');
        }
        

      } else {
        // Handle errors, e.g., invalid credentials
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
    }
  };
  
  return (
    <div className='login_loginComponent'>
      <form onSubmit={handleSubmit}>
        <div className='login_inputGroup'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='login_inputGroup'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='login_btn'>Login</button>
      </form>
    </div>
  );
}

export default Login;

