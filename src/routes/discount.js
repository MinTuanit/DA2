const router = require("express").Router();
const discountcontroller = require("../controllers/discountcontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const discountValidation = require("../validations/discount");

router.get(
  "/",
  auth("getDiscount"),
  discountcontroller.getAllDiscounts
);

router.post(
  "/allavailable/",
  auth("getDiscount"),
  discountcontroller.getAvailableDiscounts
);

router.get(
  "/code/:code",
  auth("getDiscount"),
  discountcontroller.getDiscountByCode
);

router.get(
  "/:id",
  auth("getDiscount"),
  discountcontroller.getDiscountById
);

router.post(
  "/",
  auth("manageDiscount"),
  // validate(discountValidation.createDiscount),
  discountcontroller.createDiscount
);

router.patch(
  "/:id",
  auth("manageDiscount"),
  validate(discountValidation.updateDiscount),
  discountcontroller.updateDiscountById
);

router.delete(
  "/:id",
  auth("manageDiscount"),
  discountcontroller.deleteDiscountById
);

module.exports = router;