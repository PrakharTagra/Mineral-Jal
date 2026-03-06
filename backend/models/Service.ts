import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  parts: [
    {
      name: String,
      price: Number,
    },
  ],

  serviceCharge: {
    type: Number,
    default: 0,
  },

  discountPercent: Number,

  discountAmount: Number,

  totalAmount: Number,

  startAmc: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ServiceSchema.index({ customerId: 1 });
ServiceSchema.index({ invoiceNumber: 1 });

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);