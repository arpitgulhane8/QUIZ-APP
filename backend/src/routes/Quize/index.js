const express = require('express');
const router = express.Router();
const { solveQuiz,getQuizForSolving,deleteQuiz,getUserQuizStats,createQuiz,getQuizzesByUser,getQuizAnalysis,getQuestionAnalysis} = require("../../controller/quiz_controller.js");
const authMiddleware = require('../../middlewares/auth.js')



router.delete("/deleteQuiz/:id",authMiddleware,deleteQuiz);

router.get("/getUserQuizStats",authMiddleware,getUserQuizStats);

router.get("/getQuizzesByUser",authMiddleware,getQuizzesByUser);

router.post("/newquiz",authMiddleware,createQuiz);

router.get("/:quizId/getQuizAnalysis",authMiddleware,getQuizAnalysis);
router.get("/:quizId/getQuestionAnalysis",authMiddleware,getQuestionAnalysis);

// In your `routes/quiz.js` or wherever you define your routes
router.get("/solve/:quizId",getQuizForSolving);

router.post("/solveQuiz/:quizId",solveQuiz);
module.exports = router;