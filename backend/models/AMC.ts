import mongoose from "mongoose";

const checkpointSchema = new mongoose.Schema({
  date: Date,

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
  },

  roId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RO",
  },

  startDate: Date,

  fourMonth: checkpointSchema,
  eightMonth: checkpointSchema,
  twelveMonth: checkpointSchema,

  renewed: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    default: "ACTIVE",
  }
},
{ timestamps: true }
);

export default mongoose.models.AMC ||
mongoose.model("AMC", AMCSchema);