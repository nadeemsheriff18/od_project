import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Odheader from './Components/Odheader';
import DeniedAccess from './Components/DeniedAccess';
import History from './Components/History';
import Student from './Components/Student';
import LOGIN from './Components/LOGIN';
import ODController from './Components/ODController';
import Staff_login from './Components/Staff_login';
import ForgotPassword from './Components/ForgotPassword';
import ProtectedRoute from './Components/ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Odheader />
    <Switch>
      <Route exact path="/">
        <LOGIN />
      </Route>
      <ProtectedRoute path="/student" role="student" component={Student} />
      <ProtectedRoute path="/admin" role="admin" component={ODController} />
      <Route path="/history">
        <History />
      </Route>
      <Route path="/stafflogin">
        <Staff_login />
      </Route>
      <Route path="/forgotpwd">
        <ForgotPassword />
      </Route>
      <Route path="/access-denied">
        <DeniedAccess />
      </Route>
    </Switch>
  </BrowserRouter>
);
