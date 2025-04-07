require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&ssl=true`;

//used for connecting to mongo database
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

db = null;
//connection 
async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    await client.db("admin");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  
  }
}
function getDB() {
  if (!db) {
    throw new Error("❌ DB not connected. Call connectDB() first.");
  }
  return db;
}
module.exports = {connectDB,getDB, client };