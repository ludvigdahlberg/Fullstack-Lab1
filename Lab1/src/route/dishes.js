const express = require('express');
const router = express.Router();
const { client } = require('../database');
const { json } = require('stream/consumers');


router.get('/', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const dishes = await db.collection('dishes').find({}).toArray();
      res.json(dishes);
    } catch (error) {
      console.error(" Error fetching dishes:", error);
      res.status(404).json({ message: "Dishes not found" });
    } finally {
      await client.close();
    }
  });
  
  module.exports = router;