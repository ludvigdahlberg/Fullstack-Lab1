const express = require('express');
const router = express.Router();
const { getDB} = require('../database');



router.get('/', async (req, res) => {
    try {
      
      const db = getDB();
      const dishes = await db.collection('dishes').find({}).toArray();
      res.json(dishes);
    } catch (error) {
      console.error(" Error fetching dishes:", error);
      res.status(500).json({ message: "Dishes not found" });
    } 
  });
  
  //specific ,meal
router.get('/:name',async (req,res) => {
  const db = getDB();
  const dishName = req.params.name;

  try{
    const dish = await db.collection('dishes').findOne({
      name: { $regex: `^${dishName.trim()}$`, $options: 'i' }
    });
    

    if (!dish){
      return res.status(404).json({message: "Dish not found"})
    }

    res.json(dish)
  }catch (error){
    console.error("Error fetching dish: ", error);
    res.status(500).json({message: "Serving eror"})
  }
})
  module.exports = router;