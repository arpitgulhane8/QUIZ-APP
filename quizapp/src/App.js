import React from 'react';
import { Route, Routes,BrowserRouter } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth/Auth';
import Dashbord from './components/Dashbord/Dashbord';
import QuizInterface from './components/QuizDisplay/QuizQuestion';



function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/Dashboard" element={<Dashbord />}  />
          <Route path="/api/quiz/solve/:quizId" element={<QuizInterface/>} />
          <Route path="/" element={<Auth />}/>
        </Routes>  
      </BrowserRouter>
    </div>
  );
}

export default App;
