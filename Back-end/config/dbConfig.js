const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/e-commerce_swd2_s5";
    await mongoose.connect(mongoURI);
    console.log("DATABASE CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error);
    process.exit(1);
  }
}

module.exports = { connectToMongoDB };
