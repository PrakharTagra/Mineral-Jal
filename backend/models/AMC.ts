import mongoose from "mongoose";

const checkpointSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedOn: Date,

  partsUsed: [
    {
      name: String,
      price: Number,
    },
  ],

  notes: String,

  billAmount: {
    type: Number,
    default: 0,
  },
});

const AMCSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    roId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RO",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    fourMonth: checkpointSchema,
    eightMonth: checkpointSchema,
    twelveMonth: checkpointSchema,

    renewed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "DUE", "EXPIRED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

AMCSchema.index({ customerId: 1 });
AMCSchema.index({ roId: 1 });
AMCSchema.index({ status: 1 });

export default mongoose.models.AMC || mongoose.model("AMC", AMCSchema);