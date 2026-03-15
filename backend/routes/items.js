const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

const auth = require('../middleware/auth');

// GET /api/items      — Get all items
// POST /api/items     — Create a new item (with image upload)
router.route('/').get(getAllItems).post(auth, upload.single('image'), createItem);

// GET /api/items/:id    — Get single item
// PUT /api/items/:id    — Update an item (with optional image upload)
// DELETE /api/items/:id — Delete an item
router.route('/:id').get(getItemById).put(auth, upload.single('image'), updateItem).delete(auth, deleteItem);

module.exports = router;
