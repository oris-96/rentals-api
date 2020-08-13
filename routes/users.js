const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
// const jwt = require("jsonwebtoken");
// const config = require("config");

const { User, validate } = require("../models/users");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(400).send("selected user unavailable");
    return;
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("user already registered");
  }
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
