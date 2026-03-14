const Item = require('../models/Item');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');

// Helper: delete an object from S3
const deleteS3Object = async (key) => {
  if (!key) return;
  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    }));
  } catch (error) {
    console.error('S3 delete error:', error.message);
  }
};

// @desc    Get all items
// @route   GET /api/items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ _id: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new item
// @route   POST /api/items
const createItem = async (req, res) => {
  try {
    const { title, price, category, description } = req.body;

    const item = await Item.create({
      title,
      imageUrl: req.file ? req.file.location : undefined,
      s3Key: req.file ? req.file.key : '',
      price,
      category,
      description,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // If a new image is uploaded, delete the old one from S3
    if (req.file) {
      await deleteS3Object(item.s3Key);
      item.imageUrl = req.file.location;
      item.s3Key = req.file.key;
    }

    // Update other fields if provided
    const { title, price, category, description } = req.body;
    if (title !== undefined) item.title = title;
    if (price !== undefined) item.price = price;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete image from S3
    await deleteS3Object(item.s3Key);

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
