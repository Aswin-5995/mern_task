const router = require("express").Router();
const auth = require("../middlewares/authentication");
const controller = require("../controllers/orderController");

router.post("/", controller.createOrder);
router.get("/", controller.getOrders);
router.get("/:id", controller.getOrderById); 
router.put("/:id/status", auth(["Admin", "Staff"]), controller.updateOrderStatus);

module.exports = router;
