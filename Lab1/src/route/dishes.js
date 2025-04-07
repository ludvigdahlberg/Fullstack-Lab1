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
  
  

  module.exports = router;