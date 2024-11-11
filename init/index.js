const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("connected to DB");
}

async function initDB() {
  try {
    await Listing.deleteMany({}); // Clear the collection
    
    // Ensure the data includes the correct 'geometry' structure
    const modifiedData = initData.data.map((obj) => ({
      ...obj,
      owner: "6697bc9980bb000827139c30" // Ensure this ID is valid
    }));
    
    // Insert data
    console.log("Inserting data:", modifiedData); // Debugging line
    await Listing.insertMany(modifiedData);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  } finally {
    mongoose.connection.close(); // Close the connection when done
  }
}

main().then(initDB).catch((err) => {
  console.error("Connection error:", err);
});
