import React, { useState } from 'react';
import './createquize.css';

function CreateQuize({ onClose, onContinue }) {
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("Q & A");

  const handleContinue = () => {
    onContinue({ quizName, quizType });
  };

  return (
    <div className='createQuize'>
      <form className='createQuize_form'>
        
          <input
            type="text"
            placeholder='Quiz Name'
            name="quizName"
            className='createQuize__quizeName'
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            style={{width:"80%"}}

          />
        
        <label className='createQuize_creatQuizeComponent'>
          Quiz Type
          <div className='createQuize_choice'>
            <button
              type="button"
              name='quizType'
              onClick={() => setQuizType("Q & A")}
              style={{ backgroundColor: quizType === "Q & A" ? "#60B84B" : "",color: quizType === "Q & A" ? "white" : ""}}
            >
              Q & A
            </button>
            <button
              type="button"
              name='quizType'
              onClick={() => setQuizType("Poll Type")}
              style={{ backgroundColor: quizType === "Poll Type" ? "#60B84B" : ""}}
            >
              Poll Type
            </button>
          </div>
        </label>
        <div className="actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="button" style={{ backgroundColor: "#60B84B" }} onClick={handleContinue}>Continue</button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuize;
