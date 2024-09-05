
const Quiz = require('../models/quiz');
const Question = require('../models/Question');

const { model } = require("mongoose");
const { response } = require('../app');

// Create a new quiz with questions
exports.createQuiz = async (req, res) => {
  try {
    const { title, type, questions } = req.body;
    const id = req.user.id;

    // Create the quiz
    const newQuiz = new Quiz({ title, type, createdBy: id });
    const savedQuiz = await newQuiz.save();

    // Save each question associated with the quiz
    const savedQuestions = await Promise.all(
      questions.map(async (q) => {
        const newQuestion = new Question({
          questionText: q.question,
          options: q.options.map((opt) => ({
            text: opt.text,
            imageUrl: opt.imageUrl || null,
            isCorrect: q.correctOption === q.options.indexOf(opt),
          })),
          timer: q.timer === "off" ? null : parseInt(q.timer, 10),
          quiz: savedQuiz._id,
        });
        return await newQuestion.save();
      })
    );

    // Add question IDs to the quiz
    savedQuiz.questions = savedQuestions.map((q) => q._id);
    
    // Generate the shareable link (pointing to the frontend)
    const shareableLink = `${req.protocol}://${req.get("host").replace('5000', '3000')}/api/quiz/solve/${savedQuiz._id}`;
    savedQuiz.url = shareableLink;

    // Save the quiz again with the URL and question references
    await savedQuiz.save();

    // Return the quiz, questions, and shareable link
    res.status(201).json({ quiz: savedQuiz, questions: savedQuestions, shareableLink });
  } catch (err) {
    console.error("Error creating quiz:", err);
    res.status(500).json({ error: err.message });
  }
};



// Delete a quiz by ID with its questions
exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
console.log(quizId);
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Also delete all questions related to the quiz
    await Question.deleteMany({ quiz: quizId });

    res.status(200).json({ message: 'Quiz and related questions deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.getUserQuizStats = async (req, res) => {
    try {
        const createdBy = req.user._id; // Assuming you have authentication to get the user's ID
        
        // Total number of quizzes created by the user
        const totalQuizzes = await Quiz.countDocuments({ createdBy });
        
        // Total number of questions created by the user
        const totalQuestions = await Question.countDocuments({ quiz: { $in: await Quiz.find({ createdBy }).select('_id') } });

        // Total impressions on quizzes created by the user
        const totalImpressions = await Quiz.aggregate([
            { $match: { createdBy } },
            { $group: { _id: null, totalImpressions: { $sum: "$impressions" } } }
        ]);

        // Get all quizzes created by the user with impressions and creation date
        const userQuizzes = await Quiz.find({ createdBy }).select('title impressions createdAt').sort({ impressions: -1 });

        // Format the data for trending quizzes (e.g., top 5 based on impressions)
        const trendingQuizzes = userQuizzes.slice(0, 5).map(quiz => ({
            title: quiz.title,
            impressions: quiz.impressions,
            createdAt: quiz.createdAt,
        }));
        

        // Impressions per quiz and creation date
        const impressionsPerQuiz = userQuizzes.map(quiz => ({
            title: quiz.title,
            impressions: quiz.impressions,
            createdAt: quiz.createdAt,
        }));

        res.json({
            totalQuizzes,
            totalQuestions,
            totalImpressions: totalImpressions[0] ? totalImpressions[0].totalImpressions : 0,
            trendingQuizzes,
            impressionsPerQuiz,
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};



// Get all quizzes
exports.getQuizzesByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const quizzes = await Quiz.find({ createdBy: userId })
      .select('title createdAt impressions url')
console.log(quizzes);
    // Wrap quizzes array in an object
    res.status(200).json({ quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getQuizAnalysis = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId).populate('questions');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const responseData = {
      quizTitle: quiz.title,
      creationDate: quiz.createdAt,
      impressions: quiz.impressions,
      questions: quiz.questions.map((question) => ({
        text: question.questionText,
        attempted: question.attempted || 0,
        correct: question.answeredCorrect || 0,
        incorrect: question.answeredWrong || 0,
      })),
    };

    console.log(responseData);
    return res.status(200).json(responseData);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getQuizForSolving = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate('questions');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.solveQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected option indices
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctAnswers = 0;

    quiz.questions.forEach((question, index) => {
      const selectedOptionIndex = answers[index];
      
      if (selectedOptionIndex !== undefined && question.options[selectedOptionIndex]) {
        const selectedOption = question.options[selectedOptionIndex];

        // Increment selected count for the option
        selectedOption.selectedCount += 1;

        // Update question impressions
        question.impressions += 1;
        
        if (selectedOption.isCorrect) {
          correctAnswers += 1;
          question.answeredCorrect = (question.answeredCorrect || 0) + 1;
        } else {
          question.answeredWrong = (question.answeredWrong || 0) + 1;
        }
      }

      question.attempted = (question.attempted || 0) + 1;
      question.save();
    });

    quiz.impressions += 1;
    await quiz.save();

    res.status(200).json({
      message: 'Quiz results submitted successfully',
      correctAnswers,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    console.error('Error solving quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// Get analysis for a specific question
exports.getQuestionAnalysis = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const analysis = quiz.questions.map(question => ({
      questionText: question.questionText,
      optionAnalysis: question.options.map(option => ({
        text: option.text,
        selectedCount: option.selectedCount,
      })),
    }));

    res.status(200).json({
      analysis,
      createdAt: quiz.createdAt,
      impressions: quiz.impressions,
    });
  } catch (error) {
    console.error('Error fetching quiz analysis:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
