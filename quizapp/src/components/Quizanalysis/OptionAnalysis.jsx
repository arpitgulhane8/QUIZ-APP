import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './optionanalysis.css';

const OptionAnalysis = ({ quizId, questionIndex }) => {
  const [optionAnalysis, setOptionAnalysis] = useState(null);

  useEffect(() => {
    const fetchOptionAnalysis = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await axios.get(`/api/quiz/${quizId}/getQuestionAnalysis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched Data:', response.data);

        if (response.data && response.data.analysis && response.data.analysis[questionIndex]) {
          setOptionAnalysis(response.data.analysis[questionIndex].optionAnalysis);
        } else {
          console.error('Unexpected data structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching option analysis:', error);
      }
    };

    fetchOptionAnalysis();
  }, [quizId, questionIndex]);

  if (!optionAnalysis) {
    return <div>Loading...</div>;
  }

  return (
    <div className="option-analysis">
      <h3>{`Q.${questionIndex + 1} Option Analysis`}</h3>
      <div className="options-container">
        {optionAnalysis.map((option, oIndex) => (
          <div key={oIndex} className="option-box">
            <span className="option-count">{option.selectedCount}</span>
            <span className="option-text">{`Option ${oIndex + 1}: ${option.text}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionAnalysis;

