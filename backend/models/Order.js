const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please add a customer name'],
    trim: true,
  },
  customerPhone: {
    type: String,
    trim: true,
    default: '',
  },
  customerEmail: {
    type: String,
    trim: true,
    default: '',
  },
  customerSocial: {
    type: String,
    trim: true,
    default: '',
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
    },
  }],
  totalPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('Order', orderSchema);
