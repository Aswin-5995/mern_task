const router = require("express").Router();
const auth = require("../middlewares/authentication");
const controller = require("../controllers/productController");

router.get("/", controller.getProducts);
router.post("/", auth(["Admin"]), controller.createProduct);
router.put("/:id", auth(["Admin"]), controller.updateProduct);
router.delete("/:id", auth(["Admin"]), controller.deleteProduct);

module.exports = router;


