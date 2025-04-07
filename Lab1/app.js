require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { client, connectDB } = require('./src/database.js');
const dishesRouter = require('./src/route/dishes');
const path = require('path')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// start db connection
connectDB().then (() => {
  app.use('/api/dishes', dishesRouter);
  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("Failed to start server")
})
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// close db
process.on('SIGINT', async () => {
  await client.close();
  console.log("MongoDB disconnected");
  process.exit(0);
});


