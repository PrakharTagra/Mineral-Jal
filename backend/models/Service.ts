import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  date: String,
  parts: Array,
  serviceCharge: Number,
  discountPercent: Number,
  discountAmount: Number,
  totalAmount: Number,
  startAmc: Boolean,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);