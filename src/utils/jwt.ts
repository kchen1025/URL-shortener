import * as jwt from 'express-jwt';
// import * as jwtAuthz from 'express-jwt-authz';
import * as jwksRsa from 'jwks-rsa';

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
export const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.PROJ_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://backend-api',
  issuer: `https://${process.env.PROJ_AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});
