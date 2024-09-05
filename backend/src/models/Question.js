const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        text: String,
        isCorrect: Boolean,
        selectedCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    timer: {
      type: Number,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    attempted: {
      type: Number,
    },
    answeredCorrect: {
      type: Number,
    },
    answeredWrong: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
