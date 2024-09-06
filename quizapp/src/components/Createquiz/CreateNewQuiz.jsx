import React, { useState } from "react";
import axios from "axios";
import "./createNewQuiz.css";

const CreateNewQuiz = ({ onClose, quizName, quizType }) => {
  const [questions, setQuestions] = useState([
    {
      question: "",
      optionType: "text",
      options: [{ text: "", imageUrl: "" }],
      timer: "off",
      correctOption: null,
    },
  ]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [shareableLink,setShareableLink] = useState("");

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        optionType: "text",
        options: [{ text: "", imageUrl: "" }],
        timer: "off",
        correctOption: null,
      },
    ]);
    setActiveQuestion(questions.length);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push({ text: "", imageUrl: "" });
    setQuestions(newQuestions);
  };

  const setCorrectOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = oIndex;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setActiveQuestion(newQuestions.length > 0 ? 0 : null);
  };

  const setTimer = (qIndex, timerValue) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].timer = timerValue;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    const quizData = {
      title: quizName,
      type: quizType,
      questions: questions.map((q) => ({
        question: q.question,
        optionType: q.optionType,
        options: q.options,
        timer: q.timer,
        correctOption: q.correctOption,
      })),
    };

    console.log(quizData);

    try {
        const token = localStorage.getItem('auth-token');
        console.log(token);
      
        const response = await axios.post(
          "https://quiz-app-backend-nzng.onrender.com/api/quiz/newquiz",
          quizData, // Pass the quizData as the request body
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Bearer token in headers
            },
          }
        );
        const link = response.data.shareableLink;
        setShareableLink(link); // Update the state with the new link
       
        console.log(link);
        console.log("Quiz created successfully:", response.data);
        //onClose();
      } catch (error) {
        console.error("Error creating quiz:", error);
      }
      
  };

  return (
    <div className="quiz-creation-container">
      <div className="header">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`question-nav ${index === activeQuestion ? "active" : ""}`}
            onClick={() => setActiveQuestion(index)}
          >
            {index + 1}
            <span
              className="remove-question"
              onClick={(e) => {
                e.stopPropagation();
                removeQuestion(index);
              }}
            >
              &times;
            </span>
          </button>
        ))}
        <button className="question-nav add-question" onClick={addQuestion}>
          +
        </button>
      </div>
      <div className="main">
        {questions.map(
          (q, qIndex) =>
            qIndex === activeQuestion && (
              <div key={qIndex} className="question-container">
                <div className="poll-question-section">
                  <div className="form-group">
                    <input
                      type="text"
                      id={`question-${qIndex}`}
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "question", e.target.value)
                      }
                      placeholder="Poll Question"
                    />
                  </div>
                </div>
                <div className="option-type-section">
                  <div className="form-group">
                    <label>Option Type</label>
                    <div className="option-type">
                      <label>
                        <input
                          type="radio"
                          name={`optionType-${qIndex}`}
                          value="text"
                          checked={q.optionType === "text"}
                          onChange={(e) =>
                            handleQuestionChange(
                              qIndex,
                              "optionType",
                              e.target.value
                            )
                          }
                        />
                        Text
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`optionType-${qIndex}`}
                          value="image"
                          checked={q.optionType === "image"}
                          onChange={(e) =>
                            handleQuestionChange(
                              qIndex,
                              "optionType",
                              e.target.value
                            )
                          }
                        />
                        Image URL
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`optionType-${qIndex}`}
                          value="text-image"
                          checked={q.optionType === "text-image"}
                          onChange={(e) =>
                            handleQuestionChange(
                              qIndex,
                              "optionType",
                              e.target.value
                            )
                          }
                        />
                        Text & Image URL
                      </label>
                    </div>
                  </div>
                </div>
                <div className="options-timer-container">
                  <div className="options-section">
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="form-group option-group">
                        <input
                          type="radio"
                          name={`correctOption-${qIndex}`}
                          checked={q.correctOption === oIndex}
                          onChange={() => setCorrectOption(qIndex, oIndex)}
                        />
                        {q.optionType !== "image" && (
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                "text",
                                e.target.value
                              )
                            }
                            placeholder="Option text"
                          />
                        )}
                        {q.optionType !== "text" && (
                          <input
                            type="text"
                            value={option.imageUrl}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                "imageUrl",
                                e.target.value
                              )
                            }
                            placeholder="Image URL"
                          />
                        )}

                        {q.options.length > 1 && (
                          <button
                            onClick={() => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].options = newQuestions[
                                qIndex
                              ].options.filter((_, i) => i !== oIndex);
                              setQuestions(newQuestions);
                            }}
                          >
                            <span>&times;</span>
                          </button>
                        )}
                      </div>
                    ))}
                    {/* Conditionally render the Add Option button */}
                    {q.options.length < 4 && (
                      <button
                        onClick={() => addOption(qIndex)}
                        className="add-option"
                      >
                        Add Option
                      </button>
                    )}
                  </div>
                  <div className="timer-section">
                    <label>Timer</label>
                    <div className="timer-options">
                      <button
                        className={`timer-option ${
                          q.timer === "off" ? "selected" : ""
                        }`}
                        onClick={() => setTimer(qIndex, "off")}
                      >
                        OFF
                      </button>
                      <button
                        className={`timer-option ${
                          q.timer === "5" ? "selected" : ""
                        }`}
                        onClick={() => setTimer(qIndex, "5")}
                      >
                        5 sec
                      </button>
                      <button
                        className={`timer-option ${
                          q.timer === "10" ? "selected" : ""
                        }`}
                        onClick={() => setTimer(qIndex, "10")}
                      >
                        10 sec
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
      <div className="form-actions">
        <button className="c_cancel" onClick={onClose}>Cancel</button>
        <button className="create-quiz" onClick={handleSubmit}>Create Quiz</button>
      </div>
      {shareableLink && (
  <div className="shareable-link">
    <p>Quiz created! Share this link:</p>
    <input type="text" value={shareableLink} readOnly />
    <button onClick={() => navigator.clipboard.writeText(shareableLink)}>
      Copy Link
    </button>
  </div>
)}

    </div>
    
  );
};

export default CreateNewQuiz;
