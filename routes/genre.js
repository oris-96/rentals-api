const { Genre, validate } = require("../models/genre");
//const asyncMiddleware = require("../middleware/async");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const genre = await Genre.find().sort({
    name: 1,
  });
  res.send(genre);
});

router.get("/:genreId", async (req, res) => {
  const genre = await Genre.findById(req.params.genreId);
  if (!genre) {
    res.status(404).send("this selected genre is not available");
    return;
  }
  res.send(genre);
});

router.put("/:genreId", auth, async (req, res) => {
  //validate inputs using joi
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genre = await Genre.findByIdAndUpdate(
    req.params.genreId,
    { $set: { name: req.body.name } },
    { new: true }
  );
  if (!genre) {
    return res.status(404).send("this selected genre is not available");
  }

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  //validate the input
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //since we want to update we should b using let to allow changes
  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    return res.status(404).send("this selected genre is not available");
  }
  res.send(genre);
});

module.exports = router;
