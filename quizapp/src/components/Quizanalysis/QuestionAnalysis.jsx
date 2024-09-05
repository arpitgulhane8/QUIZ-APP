import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './questionanalysis.css';
import OptionAnalysis from './OptionAnalysis';

const QuestionAnalysis = ({ quizId }) => {
  const [quizData, setQuizData] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  useEffect(() => {
    const fetchQuizAnalysis = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await axios.get(`/api/quiz/${quizId}/getQuizAnalysis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizData(response.data);
      } catch (error) {
        console.error('Error fetching quiz analysis:', error);
      }
    };

    fetchQuizAnalysis();
  }, [quizId]);

  if (!quizData) {
    return <div>Loading...</div>;
  }

  const handleStatClick = (index) => {
    setSelectedQuestionIndex(index);
  };

  return (
    <div className="question-analysis-container">
      <div className="questionAnalysis-quiz-info">
        <h2>{quizData.quizTitle} Question Analysis</h2>
        <p className="quiz-meta" style={{ color: '#FF5D01' }}>
          Created on: <span className="creation-date">{new Date(quizData.creationDate).toLocaleDateString()}</span>
          <br />
          Impressions: <span className="impressions">{quizData.impressions}</span>
        </p>
      </div>
      <div className="questionAnalysis-questioncontainer" style={{ width: '90%' }}>
        {quizData.questions.map((question, index) => (
          <div key={index} className="question-analysis">
            <h3>{`Q.${index + 1} ${question.text}`}</h3>
            <div className="questionAnalysis-statcontainer" onClick={() => handleStatClick(index)}>
              <div className="questionAnalysis-stat">
                <h2>{question.attempted}</h2>
                <span>people Attempted the question</span>
              </div>
              <div className="questionAnalysis-stat">
                <h2>{question.correct}</h2>
                <span>people Answered Correctly</span>
              </div>
              <div className="questionAnalysis-stat">
                <h2>{question.incorrect}</h2>
                <span>people Answered Incorrectly</span>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>

      {/* Conditionally render the OptionAnalysis component */}
      {selectedQuestionIndex !== null && (
        <OptionAnalysis quizId={quizId} questionIndex={selectedQuestionIndex} />
      )}
    </div>
  );
};

export default QuestionAnalysis;
