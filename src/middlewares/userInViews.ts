import * as express from 'express';

export const userInViews = () => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.locals.user = req.user;
    next();
  };
};
