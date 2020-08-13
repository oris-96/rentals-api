const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const moviesSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  numberInStock: { type: Number, min: 0, max: 255, required: true },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
  genre: {
    type: genreSchema,
    required: true,
  },
});

const Movie = mongoose.model("Movie", moviesSchema);

function validateMovies(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };
  return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovies;
