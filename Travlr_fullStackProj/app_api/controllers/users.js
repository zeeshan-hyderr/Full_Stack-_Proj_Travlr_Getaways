const User = require('../models/user');

// Controller: register a new user
exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email }).exec();
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const user = new User({ email, name });
    user.setPassword(password);
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Controller: login and return JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = user.generateJWT();
    res.json({ token });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Login error' });
  }
};