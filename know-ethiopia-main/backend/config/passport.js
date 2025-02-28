const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const hasGoogleConfig =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

if (hasGoogleConfig) {
  // Configure Google OAuth Strategy when credentials are available
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          'https://knowindiaback.vercel.app/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          displayName: profile.displayName,
          email:
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null,
          photo:
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null,
        };
        return done(null, user);
      }
    )
  );
} else {
  console.warn(
    'Google OAuth not configured: GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set. Auth routes will be disabled.'
  );
}

module.exports = passport;

