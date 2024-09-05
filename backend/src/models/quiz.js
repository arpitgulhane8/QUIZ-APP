const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  url: {  
    type: String,
  }
},{timestamps:true});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
