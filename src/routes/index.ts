import * as express from 'express';
import * as Joi from 'joi';
import * as shortid from 'shortid';
import { GenericError, NotFoundError, ValidationError } from '../errors';
import UrlMapping from '../models/UrlMapping';
import { UrlMappingType } from '../types';

export const apiRouter = express.Router();

/**
 * GET /api/mapping
 * Gets all mappings
 */
apiRouter.get('/mapping', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const UrlMappingConstructor = new UrlMapping();
  try {
    const result: UrlMappingType[] = await UrlMappingConstructor.getAll();
    res.send(result);
  } catch (err) {
    console.error(err);
    return next(new GenericError(`Error occured retrieving url mappings`));
  }
});

/**
 * GET /api/mapping/:shortId
 * @param req.params.shortId {String} shortId to be retrieved
 * Pass a shortId to be retrieved from the database, if success, will redirect.
 * Otherwise, throw an error
 */
apiRouter.get('/mapping/:shortId', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    const result: UrlMappingType = await UrlMappingConstructor.getByShortId(shortId);
    if (!result.long_url) {
      return next(new NotFoundError(`No url mapping was found for shortId ${shortId}`));
    }
    res.redirect(result.long_url);
  } catch (err) {
    console.error(err);
    return next(new GenericError(`Error occured long url for shortId ${shortId}`));
  }
});

/**
 * POST /api/generateShortId
 * @param req.body.originalUrl {String} the original URL to be shortened
 * Send a request to generate a new shortId based on originalUrl, and return the new id
 */
apiRouter.post('/generateShortId', async (req, res, next) => {
  // validate it is a properly formatted url
  const { originalUrl } = req.body;
  console.log(req.body);

  const schema: Joi.ObjectSchema = Joi.object().keys({
    originalUrl: Joi.string().uri().required()
  });
  const validation: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (validation.error) {
    return next(new ValidationError(validation.error.message, `Url to be shortened is invalid`));
  }

  // insert into db, on conflict, we want to return an error here
  const UrlMappingConstructor = new UrlMapping();
  let storedRecord = null;
  try {
    storedRecord = await UrlMappingConstructor.storeUrl(originalUrl);
  } catch (err) {
    return next(new GenericError(err, `Unable to store url ${originalUrl}`));
  }

  res.send(storedRecord);
});
