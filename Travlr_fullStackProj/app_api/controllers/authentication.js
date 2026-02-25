// app_api/controllers/authentication.js
const passport = require('passport');
const User = require('../models/user');

// Register - create user and return a JWT
exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existing = await User.findOne({ email }).exec();
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = new User({ email, name });
    user.setPassword(password);
    await user.save();

    // Option: return JWT immediately after registration
    const token = user.generateJWT();
    return res.status(201).json({ token });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

// Login - use passport local strategy, then return JWT
exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (user) {
      const token = user.generateJWT();
      return res.status(200).json({ token });
    } else {
      return res.status(401).json(info);
    }
  })(req, res);
};