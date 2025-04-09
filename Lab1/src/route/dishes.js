const express = require('express');
const router = express.Router();
const Dish = require('../Dish');



router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find(); 
    res.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ message: "Dishes not found" });
  }
});
  
  //specific ,meal
  router.get('/:name', async (req, res) => {
    const dishName = req.params.name;
  
    try {
      const dish = await Dish.findOne({
        name: new RegExp(`^${dishName.trim()}$`, 'i') 
      });
  
      if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
      }
  
      res.json(dish);
    } catch (error) {
      console.error("Error fetching dish:", error);
      res.status(500).json({ message: "Server error" });
    }
  });


//add new dish

router.post('/', async (req, res) => {
  const { name, ingredients, preperationSteps, cookingTime, origin, tasteRanking } = req.body;

  try {
    const existingDish = await Dish.findOne({
      name: new RegExp(`^${name}$`, 'i') 
    });

    if (existingDish) {
      return res.status(409).json({ message: "Dish already exists" });
    }

    const newDish = new Dish({ name, ingredients, preperationSteps, cookingTime, origin, tasteRanking });
    await newDish.save();

    res.status(201).json(newDish);
  } catch (error) {
    console.error("Error adding dish:", error);
    res.status(500).json({ message: "Could not add dish" });
  }
});

  module.exports = router;