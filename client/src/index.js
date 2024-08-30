import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Student from './Student';
import LOGIN from './Components/LOGIN';
import ODController from './Components/ODController';
import Odheader from './Components/Odheader';
import { BrowserRouter,Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LOGIN />} />
     <Route path='/admin' element={<ODController />}/>
    </Routes></BrowserRouter>
  </React.StrictMode>
);