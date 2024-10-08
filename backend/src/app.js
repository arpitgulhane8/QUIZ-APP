const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(cors({
    origin:["https://quiz-app-mocha-six.vercel.app",
            "https://quiz-app-git-master-arpit-gulhanes-projects.vercel.app",
            "https://quiz-7vbhmm431-arpit-gulhanes-projects.vercel.app" ],
    credentials: true,
    exposedHeaders: ['auth-token'],
}));

app.use(express.json());

app.use(express.static(path.join('public')));

app.use(cookieParser()); 


module.exports = app;
