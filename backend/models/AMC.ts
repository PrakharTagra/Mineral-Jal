import mongoose from "mongoose";

const AmcSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  roId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RO",
  },

  startDate: {
    type: Date,
    required: true,
  },

  fourMonth: {
    completed: { type: Boolean, default: false },
    date: Date,
  },

  eightMonth: {
    completed: { type: Boolean, default: false },
    date: Date,
  },

  twelveMonth: {
    completed: { type: Boolean, default: false },
    date: Date,
  },

  status: {
    type: String,
    default: "ACTIVE",
  },

  partsUsed: [
    {
      name: String,
      price: Number,
    },
  ],

  billAmount: {
    type: Number,
    default: 0,
  },

  notes: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AMC ||
  mongoose.model("AMC", AmcSchema);