const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(cors({
    origin:"https://quiz-8mk1o859b-arpit-gulhanes-projects.vercel.app/",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    exposedHeaders: ['auth-token'],
}));

app.use(express.json());

app.use(express.static(path.join('public')));

app.use(cookieParser()); 


module.exports = app;
