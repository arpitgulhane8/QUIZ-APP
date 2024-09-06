import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./QuizQuestion.css";
import { useParams } from "react-router-dom";
import QuizResult from "./QuizeResult";
import PollResult from "./PollResult";

const QuizInterface = () => {
  const { quizId } = useParams(); // Get quiz ID from URL
  const [quiz, setQuiz] = useState(null); // Store quiz data
  const [activeQuestion, setActiveQuestion] = useState(0); // Track the active question
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [answers, setAnswers] = useState([]); // Track user's answers
  const [marks, setMarks] = useState(0); // Track user's marks
  const [isSubmitted, setIsSubmitted] = useState(false); // Track quiz submission
  const [timeLeft, setTimeLeft] = useState(null); // Track remaining time for the current question

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `https://quiz-app-backend-nzng.onrender.com/api/quiz/solve/${quizId}`
        );
        if (response.data) {
          setQuiz(response.data); // Store quiz data in state
          setAnswers(new Array(response.data.questions.length).fill(null)); // Initialize answers array
        } else {
          console.error("No quiz data received");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Memoize handleNext to prevent re-creation on every render
  const handleNext = useCallback(() => {
    if (quiz && activeQuestion < quiz.questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
      setSelectedOption(answers[activeQuestion + 1]); // Set the previously selected option, if any
    }
  }, [quiz, activeQuestion, answers]);

  // Handle option selection
  const handleOptionSelect = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[activeQuestion] = index;
    setAnswers(updatedAnswers);
    setSelectedOption(index);
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `https://quiz-app-backend-nzng.onrender.com/api/quiz/solveQuiz/${quizId}`,
        { answers }
      );

      // Calculate marks if it's a Q & A type quiz
      if (quiz.type === "Q & A") {
        let calculatedMarks = 0;
        quiz.questions.forEach((question, index) => {
          if (
            question.options[answers[index]] &&
            question.options[answers[index]].isCorrect
          ) {
            calculatedMarks += 1; // or any other logic to calculate marks
          }
        });
        setMarks(calculatedMarks);
      }

      setIsSubmitted(true);
      console.log("Quiz results:", response.data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  // Timer functionality
  useEffect(() => {
    if (quiz && quiz.questions[activeQuestion].timer) {
      setTimeLeft(quiz.questions[activeQuestion].timer);

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            clearInterval(timer);
            handleNext(); // Call the memoized handleNext function
            return 0; // Ensure timeLeft doesn't go below zero
          }
        });
      }, 1000);

      return () => clearInterval(timer); // Clean up the timer on unmount
    } else {
      setTimeLeft(null);
    }
  }, [activeQuestion, quiz, handleNext]); // Added handleNext as a dependency

  if (isSubmitted) {
    return quiz.type === "Q & A" ? (
      <QuizResult marks={marks} />
    ) : (
      <PollResult />
    );
  }

  return (
    <div className="yo">
      {quiz ? (
        <div className="quizinterface-container">
          <div className="quizinterface-header">
            <span className="quizinterface-questionNumber">{`${
              activeQuestion + 1
            }/${quiz.questions.length}`}</span>
            {timeLeft !== null && (
              <span className="quizinterface-timer">{`${timeLeft}s`}</span>
            )}
          </div>
          <div className="quizinterface-questionText">
            {quiz.questions[activeQuestion].questionText}
          </div>
          <div className="quizinterface-optionsContainer">
            {quiz.questions[activeQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`quizinterface-option ${
                  selectedOption === index ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                {option.text}
              </div>
            ))}
          </div>
          {activeQuestion < quiz.questions.length - 1 ? (
            <button className="quizinterface-nextButton" onClick={handleNext}>
              NEXT
            </button>
          ) : (
            <button
              className="quizinterface-submitButton"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QuizInterface;

