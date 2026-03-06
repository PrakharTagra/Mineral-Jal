import mongoose from "mongoose";

const ROSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    index: true
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  model: String,

  installDate: Date,

  note: String,

  components: [
    {
      id: Number,
      name: String,

      price: {
        type: Number,
        default: 0
      },

      quantity: {
        type: Number,
        default: 1
      }
    }
  ],

  installationCost: {
    type: Number,
    default: 0
  },

  discountPercent: {
    type: Number,
    default: 0
  },

  discountAmount: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    default: 0
  },

  startAmc: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.RO || mongoose.model("RO", ROSchema);