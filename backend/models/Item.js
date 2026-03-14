const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300',
  },
  s3Key: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized',
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  versionKey: false,  // removes __v
});

module.exports = mongoose.model('Item', itemSchema);
