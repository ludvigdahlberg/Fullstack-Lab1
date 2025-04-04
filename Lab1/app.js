require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { client, connectDB } = require('./src/database.js');
const dishesRouter = require('./src/route/dishes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/dishes', dishesRouter);


// start db connection
connectDB().catch(console.error);

// GET /api/dishes
app.get('/api/dishes', async (req, res) => {
  try {
    const db = client.db(process.env.DB_NAME);
    const dishes = await db.collection('dishes').find({}).toArray();
    res.json(dishes);
  } catch (error) {
    console.error("❌ Error fetching dishes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//start server
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});

// close db
process.on('SIGINT', async () => {
  await client.close();
  console.log("MongoDB disconnected");
  process.exit(0);
});


