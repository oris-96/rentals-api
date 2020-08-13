const express = require("express");
const _ = require("lodash");

const bcrypt = require("bcrypt");
const Joi = require("joi");

const { User } = require("../models/users");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("invalid email or password");
    return;
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("invalid email or password");
    return;
  }

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
