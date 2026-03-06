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
      name: String,
<<<<<<< HEAD

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
=======
      price: Number,
    },
  ],

  installationCost: Number,

  discountPercent: Number,

  discountAmount: Number,

  totalAmount: Number,
>>>>>>> parent of 612952b (11)

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