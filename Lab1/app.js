require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dishesRouter = require('./src/route/dishes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to MongoDB with Mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&ssl=true`)
.then(() => {
  console.log("Connected to MongoDB with Mongoose");
  app.use('/api/dishes', dishesRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

// Optional: clean shutdown for Mongoose
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed");
  process.exit(0);
});
