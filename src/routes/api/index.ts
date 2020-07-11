import * as express from 'express';
import * as Joi from 'joi';
import { GenericError, ValidationError } from '../../errors';
import UrlMapping from '../../models/UrlMapping';
import { UrlMappingType } from '../../types';

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
 * GET /api/mapping/:mappingId
 * Get mapping row for a specific id (for testing purposes)
 */
apiRouter.get('/mapping/:mappingId', async (req, res, next) => {
  const { mappingId } = req.params;

  // insert into db, on conflict, we want to return an error here
  const UrlMappingConstructor = new UrlMapping();
  let storedRecord: UrlMappingType | null = null;
  try {
    storedRecord = await UrlMappingConstructor.getById(parseInt(mappingId, 10));
  } catch (err) {
    return next(new GenericError(err, `Unable to get row by id ${mappingId}`));
  }
  res.send(storedRecord);
});

/**
 * POST /api/generateShortId
 * @param req.body.originalUrl {String} the original URL to be shortened
 * Send a request to generate a new shortId based on originalUrl, and return the new id
 */
apiRouter.post('/generateShortId', async (req, res, next) => {
  // validate it is a properly formatted url
  const { originalUrl } = req.body;

  const schema: Joi.ObjectSchema = Joi.object().keys({
    originalUrl: Joi.string().uri().required()
  });
  const validation: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (validation.error) {
    return next(new ValidationError(validation.error.message, `Url to be shortened is invalid`));
  }

  // insert into db, on conflict, we want to return an error here
  const UrlMappingConstructor = new UrlMapping();
  let storedRecord: UrlMappingType | null = null;
  try {
    storedRecord = await UrlMappingConstructor.storeUrl(originalUrl);
  } catch (err) {
    return next(new GenericError(err, `Unable to store url ${originalUrl}`));
  }
  res.send(storedRecord);
});

/**
 * POST /api/test/:mappingId
 * @param req.body.visited {Number} number to set visited to
 * Sets a mapping row to visited count (for testing purposes)
 */
apiRouter.post('/test/:mappingId', async (req, res, next) => {
  const { mappingId } = req.params;
  const { visited }: { visited: number } = req.body;

  // insert into db, on conflict, we want to return an error here
  const UrlMappingConstructor = new UrlMapping();
  let storedRecord: UrlMappingType | null = null;
  try {
    storedRecord = await UrlMappingConstructor.updateVisitedById(parseInt(mappingId, 10), visited);
  } catch (err) {
    return next(new GenericError(err, `Unable to update visited by id ${mappingId}`));
  }
  res.send(storedRecord);
});
