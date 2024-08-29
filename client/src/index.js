import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Student from './Student';
import LOGIN from './Components/LOGIN';
import ODController from './Components/ODController';
import Odheader from './Components/Odheader';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LOGIN/>
    {/* <Student /> */}
  </React.StrictMode>
);


