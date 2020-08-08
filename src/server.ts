import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';
import { errorHandler, userInViews } from './middlewares';
import { apiRouter } from './routes/api';
import { authRouter } from './routes/auth';
import { indexRouter } from './routes/index';
import { userRouter } from './routes/user';

// Load Passport
import * as passport from 'passport';
import * as Auth0Strategy from 'passport-auth0';

const app = express();

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.PROJ_AUTH0_DOMAIN || '',
    clientID: process.env.PROJ_AUTH0_CLIENT_ID || '',
    clientSecret: process.env.PROJ_AUTH0_CLIENT_SECRET || '',
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/auth/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'keyboard cat',
    cookie: {},
    resave: true,
    saveUninitialized: true
  })
);

if (process.env.NODE_ENV === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  // sess.cookie.secure = true;
  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// You can use this section to keep a smaller payload
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// avoid 304 not modified
app.get('/*', (req, res, next) => {
  res.setHeader('Last-Modified', new Date().toUTCString());
  next();
});

// log requests
app.use(morgan('tiny'));

app.use(userInViews());
app.use('/auth', authRouter);
app.use('/in', indexRouter);
app.use('/api', apiRouter);
app.use('/user', userRouter);

// error handler, parse out specific errors here
app.use(errorHandler);

export { app };
