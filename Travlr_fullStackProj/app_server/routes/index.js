const express = require('express');
const router = express.Router();
const ctrlMain = require('../controllers/main');
const travelerController = require('../controllers/travelerController');

router.get('/', (req, res) => res.render('index', { title: 'Home' }));
router.get('/about', ctrlMain.about);
router.get('/contact', ctrlMain.contact);
router.get('/rooms', ctrlMain.rooms);
router.get('/meals', ctrlMain.meals);
router.get('/news', ctrlMain.news);
router.get('/travel', travelerController.travel);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Trip = require('../../app_api/models/travlr');

// // Import controllers
// const ctrlMain = require('../controllers/main');
// const travelerController = require('../controllers/travelerController');

// // Main routes
// router.get('/', (req, res) => {
//   res.render('index', { title: 'Home' });
// });
// router.get('/about', ctrlMain.about);
// router.get('/contact', ctrlMain.contact);
// router.get('/rooms', ctrlMain.rooms);
// router.get('/meals', ctrlMain.meals);
// router.get('/news', ctrlMain.news);

// // Travel route uses travelerController
// router.get('/travel', travelerController.travel);

// module.exports = router;
