import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import Model from './models/model';
// import { queryPromise } from './utils/queryFunctions';

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

apiRouter.get('/:shortId', async (req: express.Request, res: express.Response) => {
  res.send('shortId');
});

apiRouter.post('/generateShortId', async (req, res) => {});

app.use('/api', apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up! at ${port}`);
});
