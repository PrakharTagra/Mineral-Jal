// const { MongoClient } = require("mongodb");
// require("dotenv").config({ path: "./config.env" });

// const client = new MongoClient(process.env.ATLAS_URI, {
//   serverSelectionTimeoutMS: 5000,
// });

// async function connectDB() {
//   try {
//     await client.connect();
//     console.log("MongoDB connected successfully");
//     return client;
//   } catch (err) {
//     console.error("MongoDB connection failed", err);
//     process.exit(1);
//   }
// }

// module.exports = connectDB;
