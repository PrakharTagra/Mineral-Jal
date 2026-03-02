import mongoose from "mongoose";

const ROSchema = new mongoose.Schema({
  invoiceNumber: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  model: String,
  installDate: String,
  note: String,
  components: Array,
  installationCost: Number,
  discountPercent: Number,
  discountAmount: Number,
  totalAmount: Number,
  startAmc: Boolean,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RO ||
  mongoose.model("RO", ROSchema);