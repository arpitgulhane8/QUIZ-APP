import React, { useState } from 'react';
import Signin from './Signin';
import Login from './Login';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // true for Login, false for Sign Up

  return (
    <div className='auth'>
      <div className='authContainer'>
        <p className='auth_quizze'>QUIZZIE</p>
        <div className='a_groupBtn'>
          <button className='a_btn' onClick={() => setIsLogin(false)}>Sign Up</button>
          <button className='a_btn' onClick={() => setIsLogin(true)}>Login</button>
        </div>
        <div className='isLogin'>
          {isLogin ? <Login /> : <Signin />}
        </div>
      </div>
    </div>
  );
}

export default Auth;
