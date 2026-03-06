import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
{
  invoiceNumber: {
    type: String,
    required: true,
    index: true
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
    index: true
  },

  roId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RO",
    default: null, // optional
    index: true
  },

  roModel: String, // for external RO services

  date: {
    type: Date,
    required: true
  },

  parts: [
    {
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

  serviceCharge: {
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

  notes: String,

  serviceType: {
    type: String,
    enum: ["NORMAL", "AMC"],
    default: "NORMAL"
  }

},
{ timestamps: true }
);

ServiceSchema.index({ customerId: 1 });
ServiceSchema.index({ roId: 1 });
ServiceSchema.index({ invoiceNumber: 1 });

export default mongoose.models.Service ||
mongoose.model("Service", ServiceSchema);