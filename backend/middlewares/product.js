
module.exports = (req, res, next) => {
  const { name, price, stock } = req.body;
  if (!name || price <= 0 || stock < 0) {
    return res.status(400).json({ message: "Invalid product data" });
  }
  next();
};
