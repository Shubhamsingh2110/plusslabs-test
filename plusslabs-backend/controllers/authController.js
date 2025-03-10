const { OAuth2Client } = require('google-auth-library');
const { User } = require("../models/user");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { credential, isSignup } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      // Create new user with default values if Google doesn't provide them
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const newUser = {
        email: payload.email,
        firstName: payload.given_name || payload.name || 'User',
        lastName: payload.family_name || payload.family_name || 'Unknown',
        googleId: payload.sub,
        verified: payload.email_verified || false,
        password: randomPassword,
        role: "user"
      };

      try {
        user = new User(newUser);
        await user.save();
        console.log('New user created via Google Auth:', user._id);
      } catch (saveError) {
        console.error('Error saving user:', saveError);
        return res.status(400).json({ 
          message: "Failed to create user account",
          error: saveError.message 
        });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      message: "Authentication failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  googleAuth
};
