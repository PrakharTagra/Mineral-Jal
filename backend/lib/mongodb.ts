import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

export async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected");
}