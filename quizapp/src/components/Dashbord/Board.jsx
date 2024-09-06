import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import './Board.css';
import Eye from '../../assest/eye.png';

function Board() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0,
    trendingQuizzes: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await axios.get('https://quiz-app-backend-nzng.onrender.com/api/quiz/getUserQuizStats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats({
          totalQuizzes: response.data.totalQuizzes,
          totalQuestions: response.data.totalQuestions,
          totalImpressions: response.data.totalImpressions,
          trendingQuizzes: response.data.trendingQuizzes,
        });
      } catch (error) {
        console.error('Error fetching quiz stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='board'>
      <div className='board-one'>
        <div className="board-stat" style={{ color: "#FF5D01" }}>
          <h1 style={{ color: "#FF5D01" }}>{stats.totalQuizzes}</h1>
          <p>Quiz Created</p>
        </div>
        <div className="board-stat" style={{ color: "light green" }}>
          <h1 style={{ color: "#60B84B" }}>{stats.totalQuestions}</h1>
          <p style={{ color: "#60B84B" }}>Questions Created</p>
        </div>
        <div className="board-stat" style={{ color: "#5076FF" }}>
          <h1>{stats.totalImpressions}</h1>
          <p>Total Impressions</p>
        </div>
      </div>
      <div className='board-a'>
        <p>Trending Quizzes</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', width: '100%', padding: "10px", boxSizing: "border-box" }}>
          {stats.trendingQuizzes.map((quiz, index) => (
            <div 
              key={index} 
              style={{  
                padding: '10px', 
                borderRadius: '5px', 
                textAlign: 'center', 
                backgroundColor: "white",
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(255, 255, 255, 0.5)" 
              }}>
              <div style={{ display: "flex", justifyContent: 'space-around' }}>
                <h4 style={{ margin: '10px 0', color: '#000' }}>{quiz.title}</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={Eye} alt='eye' style={{ width: "15px", height: "15px" }} />
                  <p style={{ margin: '5px 0', color: 'orange', fontSize: "15px" }}>{quiz.impressions}</p>
                </div>
              </div>
              <p style={{ margin: '5px 0', color: '#777', fontSize: "10px"}}>Created on: {new Date(quiz.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Board;
