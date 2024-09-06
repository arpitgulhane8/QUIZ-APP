import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signin.css';

function Signin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ message: '', type: '' }); // Popup state
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!name) newErrors.name = "Invalid name";
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid Email";
    if (password.length < 6) newErrors.password = "Weak password";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await axios.post('https://quiz-app-backend-nzng.onrender.com/api/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });
  
      if (response.status === 201) {
        setPopup({ message: 'Signup successful!', type: 'success' });
        localStorage.setItem('token', response.data.token); // Save token or other auth info
        setTimeout(() => {
          setPopup({ message: '', type: '' });
          navigate('/');
        }, 2000); // Hide popup after 2 seconds and navigate
      } else {
        setPopup({ message: 'Signup failed: ' + response.data.message, type: 'error' });
      }
    } catch (error) {
      setPopup({ message: 'Error during signup: ' + (error.response?.data.message || error.message), type: 'error' });
    }
  };

  return (
    <div className='signin-component'>
      <form onSubmit={handleSubmit}>
        <div className='signin_inputGroup'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'error' : ''}
            required
            style={{width:"60%",border:"none"}}
          />
          {errors.name && <span className='error-message'>{errors.name}</span>}
        </div>
        <div className='signin_inputGroup'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className='error-message'>{errors.email}</span>}
        </div>
        <div className='signin_inputGroup'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <span className='error-message'>{errors.password}</span>}
        </div>
        <div className='signin_inputGroup'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'error' : ''}
            required
          />
          {errors.confirmPassword && <span className='error-message'>{errors.confirmPassword}</span>}
        </div>
        <button type='submit' className='signin_btn' disabled={!name || !email || !password || !confirmPassword}>
          Sign Up
        </button>
      </form>
      {popup.message && (
        <div className={`signin_popup ${popup.type}`}>
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default Signin;
