const express = require('express');
const router = express.Router();
const Test = require('../models/test.models');

// Get all tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single test
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new test
router.post('/', async (req, res) => {
  const test = new Test(req.body);
  try {
    const newTest = await test.save();
    res.status(201).json(newTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a test
router.put('/:id', async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTest) return res.status(404).json({ message: 'Test not found' });
    res.json(updatedTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a test
router.delete('/:id', async (req, res) => {
  try {
    const deletedTest = await Test.findByIdAndDelete(req.params.id);
    if (!deletedTest) return res.status(404).json({ message: 'Test not found' });
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
