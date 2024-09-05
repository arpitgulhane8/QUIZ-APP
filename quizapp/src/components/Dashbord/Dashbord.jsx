import React from 'react';
import { useState } from 'react';
import './Dashbord.css';
import Board from './Board';
import Analytics from '../Quizanalysis/Analytics';
import CreateQuize from '../Createquiz/CreateQuize';
import CreateNewQuiz from '../Createquiz/CreateNewQuiz';

function Dashbord() {
  const [isDashbord, setIsDashbord] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreateQuiz, setIsCreateQuiz] = useState(true);
  const [quizData, setQuizData] = useState({ quizName: "", quizType: "" });

  const handleStartQuizeCreation = (data) => {
    setQuizData(data);
    setIsCreateQuiz(false);
  };

  const handlechange = () => {
    setIsPopupOpen(false);
    setIsCreateQuiz(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming the token is stored in localStorage
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <div className='dashbord'>
      <div className='slidebar'>
        <p className='sBarE1'>QUIZZIE</p>
        <div className='sBarE2'>
          <p onClick={() => setIsDashbord(true)}>Dashboard</p>
          <p onClick={() => setIsDashbord(false)}>Analytics</p>
          <p onClick={() => setIsPopupOpen(true)}>Create Quize</p>
        </div>
        
        <div>
          <hr style={{width:"80%"}}/>
          <p className='sBarE3' onClick={handleLogout}>LOGOUT</p>
        </div>
      </div>
      <div className='display'>
        {isDashbord ? <Board /> : <Analytics />}
      </div>
      {isPopupOpen && (
        <div className="overlay">
          {isCreateQuiz ? (
            <CreateQuize onClose={() => setIsPopupOpen(false)} onContinue={handleStartQuizeCreation} />
          ) : (
            <CreateNewQuiz onClose={handlechange} onContinue={handlechange} quizName={quizData.quizName} quizType={quizData.quizType} />
          )}
        </div>
      )}
    </div>
  );
}

export default Dashbord;
