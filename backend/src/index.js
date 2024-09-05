require("dotenv").config();
const connectDB = require("./db/index.js");
const app = require("./app.js");
const authRoutes = require("./routes/auth/index.js");
const quizeRoutes = require("./routes/Quize/index.js");
const fs = require("fs");

//connection with DB
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("ERROR:", error);
      throw error;
    });

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGODB CONNECTION FAIL !!", err);
  });

//log file middleware
app.use((req, res, next) => {
  const log = `\n ${req.method}-${req.url}-${req.ip}-${new Date()}`;
  fs.appendFile("log.txt", log, (err) => {
    console.log(err);
  });
  next();
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizeRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  let log = err.stack;
  log += `\n ${req.method}-${req.url}-${req.ip}-${new Date()}`;
  fs.appendFile("error.txt", log, (error) => {
    if (error) {
      console.log(error);
    }
  });
  res.status(500).send("Something broke");
});

