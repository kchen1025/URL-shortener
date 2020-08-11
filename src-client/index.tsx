import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './main.styl';

import { Auth0Provider } from '@auth0/auth0-react';
import { SnackbarProvider } from 'notistack';
import { Home } from './views/Home';

ReactDOM.render(
  <Auth0Provider
    domain="dev-kchen.us.auth0.com"
    clientId="r58TwTiemdcLaBXRGKtnySZYuelX1bCu"
    redirectUri={window.location.origin}
    audience="https://backend-api"
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
  </Auth0Provider>,
  document.getElementById('root')
);
