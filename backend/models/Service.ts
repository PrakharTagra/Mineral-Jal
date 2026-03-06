import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({

  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  roId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RO",
    default: null,
    index: true
  },

  roModel: {
    type: String,
    default: null
  },

  date: {
    type: Date,
    required: true
  },

  parts: [
    {
      _id: false,
      name: String,
      price: { type: Number, default: 0 },
      quantity: { type: Number, default: 1 }
    }
  ],

  serviceCharge: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },

  startAmc: { type: Boolean, default: false },

  notes: String,

  serviceType: {
    type: String,
    enum: ["NORMAL", "AMC"],
    default: "NORMAL"
  }

}, { timestamps: true });

ServiceSchema.index({ invoiceNumber: 1 });
ServiceSchema.index({ customerId: 1, date: -1 });
ServiceSchema.index({ roId: 1 });

export default mongoose.models.Service ||
mongoose.model("Service", ServiceSchema);