const Product = require("../models/Product");

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
};

const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};



module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
