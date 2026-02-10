import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.ATLAS_URI);
  isConnected = true;
  console.log("MongoDB connected");
}
