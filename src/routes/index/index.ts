import * as express from 'express';
import * as Joi from 'joi';
import * as shortid from 'shortid';
import { GenericError, NotFoundError, ValidationError } from '../../errors';
import UrlMapping from '../../models/UrlMapping';
import { UrlMappingType } from '../../types';

export const indexRouter = express.Router();

/**
 * GET /:shortId
 * @param req.params.shortId {String} shortId to be retrieved
 * Pass a shortId to be retrieved from the database, if success, will redirect.
 * Otherwise, throw an error
 */
indexRouter.get('/:shortId', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { shortId } = req.params;

  const schema: Joi.ObjectSchema = Joi.object().keys({
    shortId: Joi.string().required()
  });

  // validate req params
  const validation: Joi.ValidationResult<any> = Joi.validate(req.params, schema);
  if (validation.error) {
    return next(new ValidationError(validation.error.message, `Improper shortId. Received: ${shortId}`));
  }

  // validate shortId
  if (!shortid.isValid(shortId)) {
    return next(new ValidationError('ShortId is invalid'));
  }

  const UrlMappingConstructor = new UrlMapping();
  try {
    const originalResult: UrlMappingType = await UrlMappingConstructor.getByShortId(shortId);
    if (originalResult.visited > 10) {
      return next(new GenericError(`Short id ${shortId} has been used more than 10 times and is invalid`));
    }

    // update visited count
    const updatedResult: UrlMappingType = await UrlMappingConstructor.updateVisitedById(
      originalResult.id,
      originalResult.visited + 1
    );
    if (!updatedResult.long_url) {
      return next(new NotFoundError(`No url mapping was found for shortId ${shortId}`));
    }

    res.redirect(updatedResult.long_url);
  } catch (err) {
    console.error(err);
    return next(new GenericError(`Error occured long url for shortId ${shortId}`));
  }
});
