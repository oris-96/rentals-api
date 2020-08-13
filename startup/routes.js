const express = require("express");
const errors = require("../middleware/errors");

const genre = require("../routes/genre");
const customer = require("../routes/customer");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
  //use the modueles//middleware
  app.use(express.json());
  app.use("/vidly.com/api/genres", genre);
  app.use("/vidly.com/api/customers", customer);
  app.use("/vidly.com/api/movies", movies);
  app.use("/vidly.com/api/rentals", rentals);
  app.use("/vidly.com/api/users", users);
  app.use("/vidly.com/api/auth", auth);

  app.use(errors);
};
