const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

exports.travel = async (req, res) => {
  try {
    const trips = await Trip.find().lean().exec();
    if (!trips || trips.length === 0) {
      return res.render('travel', {
        title: 'Travlr Getaways',
        trips: [],
        message: 'No trips available at this time.'
      });
    }
    res.render('travel', { title: 'Travlr Getaways', trips });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// const tripsEndpoint = 'http://localhost:3000/api/trips';
// const options = {
//   method: 'GET',
//   headers: { 'Accept': 'application/json' }
// };

// exports.travel = async (req, res) => {
//   try {
//     const response = await fetch(tripsEndpoint, options); // use global fetch (Node 18+)
//     if (!response.ok) return res.status(response.status).send(response.statusText);

//     const json = await response.json();

//     // handle case: response is not an array
//     if (!Array.isArray(json)) {
//       return res.status(500).send('Unexpected API response: expected an array of trips');
//     }

//     // handle case: empty array (no data in DB)
//     if (json.length === 0) {
//       // render page with empty trips and a message
//       return res.status(200).render('travel', {
//         title: 'Travlr Getaways',
//         trips: [],
//         message: 'No trips available at this time.'
//       });
//     }

//     // normal case
//     res.render('travel', { title: 'Travlr Getaways', trips: json });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };
