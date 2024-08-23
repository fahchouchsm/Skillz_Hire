const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to the database".bgGreen);
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};

const store = new MongoDBStore({
  uri: process.env.DB_STRING,
  collection: "sessions",
});

store.on("error", function (error) {
  console.error("Session store error:", error);
});

module.exports = { connectDB, store };
