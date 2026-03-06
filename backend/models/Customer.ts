import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  address: {
    type: String,
    trim: true,
  },

  reference: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CustomerSchema.index({ phone: 1 });

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);