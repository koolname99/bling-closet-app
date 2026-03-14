const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

// GET /api/orders         — Get all orders (supports ?status=pending filter)
// POST /api/orders        — Create a new order
router.route('/').get(getAllOrders).post(createOrder);

// GET /api/orders/:id     — Get single order
// PUT /api/orders/:id     — Update an order (status, notes, etc.)
// DELETE /api/orders/:id  — Delete an order
router.route('/:id').get(getOrderById).put(updateOrder).delete(deleteOrder);

module.exports = router;
