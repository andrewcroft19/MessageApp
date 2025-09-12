const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy((clientId, secret, done) => {
  const validClientId = process.env.BASIC_AUTH_CLIENTID;
  const validSecret = process.env.BASIC_AUTH_SECRET;

  if (clientId === validClientId && secret === validSecret) {
    return done(null, { username: clientId });
  } else {
    return done(null, false); 
  }
}));

const basicAuthMiddleware = passport.authenticate('basic', { session: false });
module.exports = basicAuthMiddleware;