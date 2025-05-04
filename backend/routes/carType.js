const express = require('express');
const router = express.Router();
const CarType = require('../models/CarType');

// GET all car types
router.get('/', async (req, res) => {
  const types = await CarType.find();
  res.json(types);
});

// POST new car type
router.post('/', async (req, res) => {
  const newType = new CarType({ name: req.body.name });
  await newType.save();
  res.json(newType);
});

module.exports = router;
