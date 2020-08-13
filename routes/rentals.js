const { Rental, validate } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customer");
const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");

Fawn.init(mongoose);
router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  res.send(rental);
});

// router.get("/:id", async (req, res) => {
//   const rental = await Rental.findById(req.params.id);
//   if (!rental) {
//     res.status(400).send(`can't find the selected item `);
//     return;
//   }
//   res.send(rental);
// });

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) {
//     res.send(error.details[0].message);
//     return;
//   }
//   const rental = await Rental.findByIdAndUpdate(
//     req.params.id,
//     {
//       $set: {
//         rented: req.body.rented,
//       },
//     },
//     { new: true }
//   );
//   res.send(rental);
// });

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    res.status(400).send("invalid customer");
    return;
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    res.status(400).send("invalid movie");
    return;
  }

  if (movie.numberInStock === 0) {
    res.send("movie not available");
  }
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("something failed");
  }
});

// router.delete("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) {
//     res.send(error.details[0].message);
//     return;
//   }
//   const rental = await Rental.findByIdAndRemove(req.params.id);
//   res.send(rental);
// });

module.exports = router;
