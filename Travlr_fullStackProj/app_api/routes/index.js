const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

const usersRouter = require('./users');
const auth = require('../middleware/auth');

// NEW: authentication controller
const authController = require('../controllers/authentication');

// Public read routes
router.get('/trips', tripsController.tripsList);
router.get('/trips/:code', tripsController.tripsReadOne);

// Protected write routes
router.post('/trips', auth, tripsController.tripsCreate);
router.put('/trips/:tripCode', auth, tripsController.tripsUpdateTrip);

// Authentication endpoints (mounted directly under /api)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Optional: existing /api/users/* routes still available
router.use('/users', usersRouter);

module.exports = router;
