import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import History from './Components/History';
import Student from './Components/Student';
import LOGIN from './Components/LOGIN';
import ODController from './Components/ODController';
import Odheader from './Components/Odheader';
import { BrowserRouter,Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LOGIN/>
    {/* <Student /> */}
  </React.StrictMode>
);