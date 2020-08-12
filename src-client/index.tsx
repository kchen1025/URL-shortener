import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './main.styl';

import { Auth0Provider } from '@auth0/auth0-react';
import { SnackbarProvider } from 'notistack';
import Home from './views/Home';

ReactDOM.render(
  <Router>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUDIENCE}
    >
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Home />
      </SnackbarProvider>
    </Auth0Provider>
  </Router>,
  document.getElementById('root')
);
