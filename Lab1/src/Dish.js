const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  ingredients: { type: [String], required: true },
  preperationSteps: { type: [String], required: true },
  cookingTime: Number,
  origin: String,
  tasteRanking: String
});

module.exports = mongoose.model('Dish', dishSchema);
