import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './main.styl';

import { SnackbarProvider } from 'notistack';
import { Home } from './views/Home';

ReactDOM.render(
  <SnackbarProvider
    autoHideDuration={3000}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
  >
    <Home />
  </SnackbarProvider>,
  document.getElementById('root')
);
