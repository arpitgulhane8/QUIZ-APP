import React, { useState, useEffect } from "react";
import axios from "axios";
import "./analytics.css";
import Remove from "../../assest/delete.png";
import Delete from "./Delete";
import QuestionAnalysis from "./QuestionAnalysis";
import share from "../../assest/share.png";
import edit from "../../assest/edit.png";

function Analytics() {
  const [quizzes, setQuizzes] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [showQuizAnalysis, setShowQuizAnalysis] = useState(false); // New state
  const [selectedQuizId, setSelectedQuizId] = useState(null); // To pass the selected quiz ID
  const [showPopup, setShowPopup] = useState(false); // New state for the popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const response = await axios.get(
          "https://quiz-app-backend-nzng.onrender.com/api/quiz/getQuizzesByUser",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
          }
        );
        setQuizzes(response.data.quizzes); // Store the fetched quizzes in state
      } catch (error) {
        console.error("Error fetching quiz stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleDeleteClick = (quizId) => {
    setQuizToDelete(quizId);
    setShowDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      await axios.delete(
        `https://quiz-app-backend-nzng.onrender.com/api/quiz/deleteQuiz/${quizToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
          },
        }
      );

      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete));
      setShowDelete(false);
      setQuizToDelete(null);

      // Show success popup
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000); // Hide the popup after 2 seconds
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleAnalysisClick = (quizId) => {
    setSelectedQuizId(quizId);
    setShowQuizAnalysis(true);
  };

  const handleShareClick = (link) => {
    const url = link; 
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000); // Hide the popup after 2 seconds
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  if (showQuizAnalysis) {
    return <QuestionAnalysis quizId={selectedQuizId} />;
  }

  return (
    <div className="quiz-analysis">
      <h1>Quiz Analysis</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created On</th>
              <th>Impression</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr
                key={quiz._id}
                className={index % 2 !== 0 ? "highlighted-row" : ""}
              >
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                <td>{quiz.impressions}</td>
                <td>
                  <div className="actions">
                    <span className="icon red-square">
                      <img src={edit} alt="edit" />
                    </span>
                    <span className="icon circle-number">
                      <img
                        src={Remove}
                        alt="delete"
                        onClick={() => handleDeleteClick(quiz._id)}
                      />
                    </span>
                    <span className="icon circle-p">
                      <img
                        src={share}
                        alt="share"
                        onClick={() => handleShareClick(quiz.url)}
                      />
                    </span>
                    <span onClick={() => handleAnalysisClick(quiz._id)}>
                      Question Wise Analysis
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDelete && (
        <div className="overlay">
          <Delete
            onClose={() => setShowDelete(false)}
            onConfirm={handleConfirmDelete}
          />
        </div>
      )}
      {showPopup && (
        <div className="analytics-popup">Link copied to clipboard!</div>
      )}
      {showSuccessPopup && (
        <div className="analytics-success-popup"><img src={Remove} alt="delete"/> Quiz deleted successfully!</div>
      )}
    </div>
  );
}

export default Analytics;

