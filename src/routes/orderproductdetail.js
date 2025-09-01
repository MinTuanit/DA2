const router = require("express").Router();
const orderproductcontroller = require("../controllers/orderproductdetail");
const validate = require("../middlewares/validate");
const orderProductDetailValidation = require("../validations/orderproductdetail");

router.get(
  "/",
  orderproductcontroller.getAllOrderProducts
);

router.get(
  "/order/:orderid",
  orderproductcontroller.getOrderProductsByOrderId
);

router.get(
  "/:id",
  orderproductcontroller.getOrderProductById
);

router.post(
  "/",
  validate(orderProductDetailValidation.createOrderProductDetail),
  orderproductcontroller.createOrderProduct
);

router.patch(
  "/:id",
  validate(orderProductDetailValidation.updateOrderProductDetail),
  orderproductcontroller.updateOrderProductById
);

router.delete(
  "/:id",
  orderproductcontroller.deleteOrderProductById
);

module.exports = router;