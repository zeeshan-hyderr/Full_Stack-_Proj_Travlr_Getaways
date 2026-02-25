const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

// GET: Return list of all trips
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find().exec();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving trips", error: err });
  }
};

// GET: Return single trip by code parameter
const tripsReadOne = async (req, res) => {
  try {
    const tripCode = req.params.code;
    const trip = await Trip.findOne({ code: tripCode }).exec();

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving trip", error: err });
  }
};

// POST: Create a new trip
const tripsCreate = async (req, res) => {
  try {
    const tripData = req.body;

    // Basic validation
    if (!tripData.name || !tripData.code || tripData.perPerson === undefined) {
      return res.status(400).json({ message: "Name, Code, and Per Person are required" });
    }

    const newTrip = new Trip(tripData);
    const savedTrip = await newTrip.save();

    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(500).json({ message: "Error creating trip", error: err.message || err });
  }
};

// PUT: Update an existing trip by code
const tripsUpdateTrip = async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.body);

    const tripCode = req.params.tripCode;
    const updatedTrip = await Trip.findOneAndUpdate(
      { code: tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    ).exec();

    if (!updatedTrip) {
      return res.status(400).json({ message: "Trip not found or could not be updated" });
    }

    res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: "Error updating trip", error: err.message || err });
  }
};

module.exports = {
  tripsList,
  tripsReadOne,
  tripsCreate,
  tripsUpdateTrip
};
