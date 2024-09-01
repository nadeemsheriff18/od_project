import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import History from './Components/History';
import Student from './Components/Student';
import LOGIN from './Components/LOGIN';
import ODController from './Components/ODController';

import Staff_login from './Components/Staff_login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LOGIN />} />
      <Route path="/student" element={<Student />} />
      <Route path="/admin" element={<ODController />} />
      <Route path='/history' element={<History />}/>
      <Route path='/stafflogin' element={<Staff_login />}/>
    </Routes>
  </BrowserRouter>
    
    
  
);