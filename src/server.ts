import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';
import { errorHandler } from './middlewares';
import { apiRouter } from './routes/api';
import { indexRouter } from './routes/index';
import { checkJwt } from './utils/jwt';

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);

// avoid 304 not modified
app.get('/*', (req, res, next) => {
  res.setHeader('Last-Modified', new Date().toUTCString());
  next();
});

// log requests
app.use(morgan('tiny'));

app.use(checkJwt);

app.use('/in', indexRouter);
app.use('/api', apiRouter);

app.get('/yeet', (req, res) => {
  res.send('hello');
});

// error handler, parse out specific errors here
app.use(errorHandler);

export { app };
