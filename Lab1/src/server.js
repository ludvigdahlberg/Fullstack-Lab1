require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;


//starting app
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
