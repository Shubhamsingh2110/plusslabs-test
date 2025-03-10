const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashPassword = await bcrypt.hash(randomPassword, salt);

          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            password: hashPassword
          });

          await user.save();
        }

        const token = user.generateAuthToken();
        return done(null, { user: user.toObject(), token });

      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);

// Updated serialization to handle the combined user-token object
passport.serializeUser((data, done) => {
  console.log('Serializing user:', data);
  done(null, { id: data.user._id, token: data.token });
});

passport.deserializeUser(async (data, done) => {
  try {
    console.log('Deserializing user:', data);
    const user = await User.findById(data.id);
    done(null, { user, token: data.token });
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
