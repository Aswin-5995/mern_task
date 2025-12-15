const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

        console.log("workingg")


    /* ✅ SAFE CHECK */
    if (req.io) {
      req.io.emit("newOrderPlaced", order);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    req.io.to(order._id.toString()).emit("orderStatusUpdated", order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};