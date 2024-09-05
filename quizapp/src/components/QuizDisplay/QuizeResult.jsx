import React from 'react';

const QuizResult = ({ marks }) => {
  return (
    <div className='quiz-result'>
      <h2>Congratulations!</h2>
      <p>You scored {marks} marks.</p>
      <div className='trophy'>🏆</div>
    </div>
  );
};

export default QuizResult;
