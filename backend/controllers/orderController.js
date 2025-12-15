const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  req.app.get("io").emit("newOrderPlaced", order);
  res.json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  req.app.get("io").emit("orderStatusUpdated", order);
  res.json(order);
};
