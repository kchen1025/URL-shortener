import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';
import { errorHandler } from './middlewares';
import { apiRouter } from './routes';

const app = express();

app.use(express.static(__dirname + 'public'));
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use('/api', apiRouter);

// error handler, parse out specific errors here
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up! at ${port}`);
});
