import * as express from 'express';

export const secureHandler = () => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.user) {
      return next();
    }
    req.session!.returnTo = req.originalUrl;
    res.redirect('/auth/login');
  };
};
