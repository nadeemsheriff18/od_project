import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';
import Odheader from './Components/Odheader';
import DeniedAccess from './Components/DeniedAccess';
import History from './Components/History';
import Student from './Components/Student';
import LOGIN from './Components/LOGIN';
import ODController from './Components/ODController';
import HOD_login from './Components/HOD_login';
import AHOD_login from './Components/AHOD_login';
//import AhodAccess from './Components/AhodAccess';
import AHODDashboard from './Components/AHODDashboard';
import ForgotPassword from './Components/ForgotPassword';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminControl from './Components/AdminControl';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <Odheader />
    <Switch>
      <Route exact path="/">
        <LOGIN />
      </Route>
        <ProtectedRoute path="/student" role="student" component={Student} />
      <ProtectedRoute path="/hod" role="hod" component={ODController} />
      {/*<Route path="/student"><Student/>
      </Route>
      <Route path="/hod"><ODController/>
      </Route>
      <Route path="/ahod"><AHODDashboard/>
      </Route>
    */}
      <ProtectedRoute path="/ahod" role="ahod" component={AHODDashboard}/>
      
      
      <Route path="/adminControl"><AdminControl/>
      </Route>

      <Route path="/history">
        <History />
      </Route>
      <Route path="/hodlogin">
        <HOD_login/>
      </Route>
      <Route path="/ahodlogin">
        <AHOD_login />
      </Route>
      <Route path="/forgotpwd">
        <ForgotPassword />
      </Route>
      <Route path="/access-denied">
        <DeniedAccess />
      </Route>
    </Switch>
  </BrowserRouter>
  </QueryClientProvider>
);
