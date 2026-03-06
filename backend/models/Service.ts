import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    parts: [
      {
        _id: false,

        id: Number,

        name: String,

        price: {
          type: Number,
          default: 0,
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    serviceCharge: {
      type: Number,
      default: 0,
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    startAmc: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ServiceSchema.index({ customerId: 1 });
ServiceSchema.index({ invoiceNumber: 1 });

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);