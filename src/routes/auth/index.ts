// routes/auth.js

import * as express from 'express';
import * as passport from 'passport';
import * as querystring from 'querystring';
import * as url from 'url';
import * as util from 'util';

export const authRouter = express.Router();

// Perform the login, after login Auth0 will redirect to callback
authRouter.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile'
  }),
  (req, res) => {
    res.redirect('/');
  }
);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
authRouter.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/auth/login');
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      const returnTo = req.session?.returnTo;
      if (req.session?.returnTo) {
        delete req.session?.returnTo;
      }
      res.redirect(returnTo || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
authRouter.get('/logout', (req, res) => {
  req.logout();

  let returnTo = req.protocol + '://' + req.hostname;
  const port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  const logoutURL = new url.URL(util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN));
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL.toString());
});
