const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const customer = await Customer.find().sort({ name: 1 });
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(400).send(`couldn't get the customer`);
  }
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  //validate input
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
      },
    },
    { new: true }
  );
  if (!customer) {
    return res.status(400).send(`couldn't update the given customer`);
  }
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let customer = await new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  try {
    customer = await customer.save();
    res.send(customer);
  } catch (err) {
    res.send(err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  res.send(customer);
});

module.exports = router;
