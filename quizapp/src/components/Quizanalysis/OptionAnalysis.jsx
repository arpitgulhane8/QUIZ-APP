import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './optionanalysis.css';

const OptionAnalysis = ({ quizId, onBackClick }) => {
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await axios.get(`/api/quiz/${quizId}/getQuestionAnalysis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizData(response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  if (!quizData || !quizData.questions) {
    return <div>Loading...</div>;
  }

  console.log(quizData.text)

  return (
    <div className="option-analysis-container">
      <div className="questionAnalysis-quiz-info">
        <h2>{quizData.quizTitle} Question Analysis</h2>
        <p className="quiz-meta" style={{ color: '#FF5D01' }}>
          Created on: <span className="creation-date">{new Date(quizData.creationDate).toLocaleDateString()}</span>
          <br />
          Impressions: <span className="impressions">{quizData.impressions}</span>
        </p>
      </div>
      <div className='Optionanalysis_container'>
      {quizData.questions.map((question, qIndex) => {
        const options = question.optionAnalysis || [];
        
        return (
          <div key={qIndex} className="option-analysis">
            <h3>{`Q.${qIndex + 1} ${question.text}`}</h3>
            <div className="options-container">
              {options.length > 0 ? (
                options.map((option, oIndex) => (
                  <div key={oIndex} className="option-box">
                    <span className="option-count">{option.selectedCount}</span>
                    <span className="option-text">{`Option ${oIndex + 1}`}</span>
                  </div>
                ))
              ) : (
                <div>No options available</div>
              )}
            </div>
          </div>
        );
      })}
      </div>
      <button onClick={onBackClick} className="back-button">Back to Questions</button>
    </div>
  );
};

export default OptionAnalysis;
