// routes/trips.js
const express = require('express');
const Trip = require('../../app_api/models/travlr');
const router = express.Router();

router.get('/trips', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

module.exports = router;
