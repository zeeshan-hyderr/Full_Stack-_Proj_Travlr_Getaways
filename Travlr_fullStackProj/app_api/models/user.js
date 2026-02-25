const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

// set password (generates salt + hash)
userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// validate password
userSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

// generate JWT
userSchema.methods.generateJWT = function() {
  const payload = {
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role
  };
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

const User = mongoose.model('User', userSchema);
module.exports = User;