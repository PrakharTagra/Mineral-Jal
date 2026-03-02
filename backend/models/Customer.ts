import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  address: String,
  reference: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);