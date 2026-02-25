// app_server/controllers/main.js

// Controller for Home page
const index = (req, res) => {
  res.render('index', { title: 'Home' });
};

// Controller for About page
const about = (req, res) => {
  res.render('about', { title: 'About Us' });
};

// Controller for Contact page
const contact = (req, res) => {
  res.render('contact', { title: 'Contact Us' });
};

// Controller for Rooms page
const rooms = (req, res) => {
  res.render('rooms', { title: 'Rooms' });
};

// Controller for Meals page
const meals = (req, res) => {
  res.render('meals', { title: 'Meals' });
};

// Controller for News page
const news = (req, res) => {
  res.render('news', { title: 'News' });
};

module.exports = {
  index,
  about,
  contact,
  rooms,
  meals,
  news
};
