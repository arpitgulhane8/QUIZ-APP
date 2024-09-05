const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// New User Registeration controller
exports.signin = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if user already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Existing user login controller
exports.login = async (req, res,next) => {
  const { email, password } = req.body;

  //check if user exist
  try {
    const existingUser = await User.findOne({ email });

    //if user does not exist
    if (!existingUser) {
      return res.status(400).json({ message: "Wrong Email or Password" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    //if password is wrong
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong Email or Password" });
    }

    //if user exist
    else {
      const token = jwt.sign(
        { _id: existingUser._id },
        process.env.TOKEN_SECRET
      );
      console.log(token);
      res.header("auth-token", token).json({ message: "Login successfully" });
    }
  } catch (err) {
    next(err);
  }
};
