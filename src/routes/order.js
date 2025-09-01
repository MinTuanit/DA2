const router = require("express").Router();
const ordercontroller = require("../controllers/ordercontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const orderValidation = require("../validations/order");

router.get(
  "/",
  ordercontroller.getAllOrders
);

router.get(
  "/ticketandproduct/:orderid",
  ordercontroller.getTicketAndProductByOrderId
);

router.get(
  "/userinfo/:orderid",
  ordercontroller.getOrderWithUserInfo
);

router.get(
  "/user/:userid",
  ordercontroller.getOrderByUserId
);

router.get(
  "/code/:ordercode",
  auth("getOrderBycode"),
  ordercontroller.getOrderByCode
);

router.get(
  "/:id",
  ordercontroller.getOrderById
);

router.get(
  "/details/:id",
  ordercontroller.getOrderWithInfoById
);

router.post(
  "/",
  validate(orderValidation.createOrder),
  ordercontroller.createOrder
);

router.post(
  "/orders",
  validate(orderValidation.createOrder),
  ordercontroller.createOrders
);

router.patch(
  "/:id",
  validate(orderValidation.updateOrder),
  ordercontroller.updateOrderById
);

router.delete(
  "/user/:userid",
  ordercontroller.deleteOrderByUserId
);

router.delete(
  "/:id",
  ordercontroller.deleteOrderById
);

module.exports = router;