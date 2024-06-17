const mongoose = require("mongoose");

const connectionString = "mongodb+srv://jamesnemeth1999:James123@namewithconventiondb.tcpdsey.mongodb.net/AtlaswithConventionDB";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(connectionString, {
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error(error);
  }
};

// connectToDatabase();

module.exports = connectToDatabase;
