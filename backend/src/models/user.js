const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    quizzes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
  },
  { timestamps: true }
);


// Hash password before saving
userSchema.pre("save", async function (next) {
  //check if password is modified
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/*
    userSchema.method.generateAccessToken = function(){
       return jwt.sign(
            {
                _id:this._id,
                email:this.email,
                name:this.name
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    }
    userSchema.method.generateRefreshToken = function(){
        return jwt.sign(
            {
                _id:this._id,
                email:this.email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }
*/
module.exports = mongoose.model("User", userSchema);
