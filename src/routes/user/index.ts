import * as express from 'express';
import { secureHandler } from '../../middlewares';

export const userRouter = express.Router();

/* GET user profile. */
userRouter.get('/', secureHandler(), (req, res, next) => {
  const { ...userProfile } = req.user;

  res.send(JSON.stringify(userProfile, null, 2));
});
