const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, minlength: 0, maxlength: 255, required: true },
      isGold: { type: Boolean, default: false },
      phone: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  retalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRentals(rentals) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(rentals, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRentals;
