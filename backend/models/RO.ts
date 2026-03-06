import mongoose from "mongoose";

const ROSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  model: String,

  installDate: Date,

  note: String,

  components: [
    {
      name: String,
      price: Number,
    },
  ],

  installationCost: Number,

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

export default mongoose.models.RO || mongoose.model("RO", ROSchema);