import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as Joi from 'joi';
// import { queryPromise } from './utils/queryFunctions';
import { ErrorBase, ValidationError } from './errors';
import Model from './models/model';
import UrlMapping from './models/UrlMapping';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);

const apiRouter = express.Router();

apiRouter.get('/test', async (req, res) => {
  const messagesModel = new Model('messages');
  try {
    // const yeet = await queryPromise('select * from messages;', []);
    const data = await messagesModel.select('name, message');
    res.send(data);
  } catch (err) {
    console.error('yeet');
  }

  res.send('api tesdstdsdfd');
});

apiRouter.get('/:shortId', async (req: express.Request, res: express.Response, next) => {
  const { shortId } = req.params;

  const schema: Joi.ObjectSchema = Joi.object().keys({
    shortId: Joi.string().required()
  });

  const validation: Joi.ValidationResult<any> = Joi.validate(req.params, schema);
  if (validation.error) {
    return next(new ValidationError(validation.error.message, `Improper shortId. Received: ${shortId}`));
  }

  const UrlMappingConstructor = new UrlMapping();
  let result: object = {};

  try {
    result = await UrlMappingConstructor.getByShortId(shortId);
  } catch (err) {
    console.error(err);
  }

  res.send(result);
});

/**
 * GET /api/generateShortId
 * @param req.body.originalUrl {String} the original URL to be shortened
 */
apiRouter.post('/generateShortId', async (req, res) => {
  // validate it is a properly formatted url

  // insert into db, on conflict, we want to return an error here

  res.send('generated short url');
});

app.use('/api', apiRouter);

// error handler, parse out specific errors here
app.use((err: ErrorBase, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API error:', err);

  // if instance of our errorbase, print out the friendly messages, otherwise output a default
  const output = {
    httpStatusCode: 500,
    friendly: 'Api error occurred',
    message: 'Api error occurred'
  };

  if (output.message) {
    output.message = err.message;
  }
  if (output.friendly) {
    output.friendly = err.friendly;
  }
  if (output.httpStatusCode) {
    output.httpStatusCode = err.httpStatusCode;
  }

  res.status(output.httpStatusCode).send(output);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up! at ${port}`);
});
