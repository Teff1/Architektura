const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Create
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List with filters & sorting
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', search, minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage, minPower, maxPower } = req.query;
    const filter = {};

    if (search) filter.$or = [
      { brand: new RegExp(search, 'i') },
      { model: new RegExp(search, 'i') }
    ];
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (minYear) filter.year = { ...filter.year, $gte: parseInt(minYear) };
    if (maxYear) filter.year = { ...filter.year, $lte: parseInt(maxYear) };
    if (minMileage) filter.mileage = { ...filter.mileage, $gte: parseInt(minMileage) };
    if (maxMileage) filter.mileage = { ...filter.mileage, $lte: parseInt(maxMileage) };
    if (minPower) filter.power = { ...filter.power, $gte: parseInt(minPower) };
    if (maxPower) filter.power = { ...filter.power, $lte: parseInt(maxPower) };

    const cars = await Car.find(filter)
      .sort({ [sortBy]: 1 })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
