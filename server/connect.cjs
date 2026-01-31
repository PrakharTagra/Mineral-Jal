const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function main() {
  try {
    const client = new MongoClient(process.env.ATLAS_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed", err);
  }
}

main();
