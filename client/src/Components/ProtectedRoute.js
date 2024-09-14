// ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const [cookies] = useCookies(['Role']);

  return (
    <Route
      {...rest}
      render={(props) =>
        cookies.Role === role ? (
          <Component {...props} />
        ) : (
          <Redirect to="/access-denied" />
        )
      }
    />
  );
};

export default ProtectedRoute;
