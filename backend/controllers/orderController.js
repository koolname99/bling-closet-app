const Order = require('../models/Order');
const Item = require('../models/Item');

// @desc    Get all orders (with optional status filter)
// @route   GET /api/orders
// @route   GET /api/orders?status=pending
const getAllOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate('items.item')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.item');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, customerSocial, items, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Please add at least one item' });
    }

    // Look up each item to get its price and calculate total
    let totalPrice = 0;
    const orderItems = [];

    for (const orderItem of items) {
      const item = await Item.findById(orderItem.item);
      if (!item) {
        return res.status(404).json({ message: `Item ${orderItem.item} not found` });
      }

      const quantity = orderItem.quantity || 1;
      const price = item.price;
      totalPrice += price * quantity;

      orderItems.push({
        item: item._id,
        quantity,
        price,
      });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      customerEmail,
      customerSocial,
      items: orderItems,
      totalPrice,
      status: 'pending',
      notes,
    });

    // Populate item details before returning
    const populatedOrder = await Order.findById(order._id).populate('items.item');
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an order (status, notes, customer info)
// @route   PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status, notes, customerName, customerPhone, customerEmail, customerSocial } = req.body;

    if (status !== undefined) order.status = status;
    if (notes !== undefined) order.notes = notes;
    if (customerName !== undefined) order.customerName = customerName;
    if (customerPhone !== undefined) order.customerPhone = customerPhone;
    if (customerEmail !== undefined) order.customerEmail = customerEmail;
    if (customerSocial !== undefined) order.customerSocial = customerSocial;

    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(updatedOrder._id).populate('items.item');
    res.json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
