const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movies");
const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort({ name: 1 });
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movies = await Movie.findById(req.params.id);
  if (!movies) {
    res.status(400).send("selected movie unavailable");
    return;
  }
  res.send(movies);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const movies = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: req.body.genre.name,
      },
    },
    { new: true }
  );
  if (!movies) {
    res.status(400).send(`selected movie can't be updated`);
  }
  res.send(movies);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  //since we embedded a genre we have to check whether the genre sent is valid
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    res.status(400).send("invalid Genre");
  }

  const movies = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  });

  try {
    await movies.save();
    res.send(movies);
  } catch (err) {
    res.send(err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const movies = await Movie.findByIdAndRemove(req.params.id);
  res.send(movies);
});

module.exports = router;
