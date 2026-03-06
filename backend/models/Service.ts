import mongoose from "mongoose";

<<<<<<< HEAD
<<<<<<< HEAD
const ServiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      index: true,
=======
=======
>>>>>>> parent of b4b1107 (update)
const ServiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
<<<<<<< HEAD
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
>>>>>>> parent of 612952b (11)
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

<<<<<<< HEAD
    date: {
      type: Date,
      required: true,
    },

    parts: [
      {
        _id: false,

        id: Number,
=======
  discountPercent: Number,

  discountAmount: Number,

  totalAmount: Number,
>>>>>>> parent of 612952b (11)

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
=======
    index: true,
>>>>>>> parent of b4b1107 (update)
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ServiceSchema.index({ customerId: 1 });
ServiceSchema.index({ invoiceNumber: 1 });

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);