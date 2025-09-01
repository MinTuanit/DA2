const router = require("express").Router();
const productcontroller = require("../controllers/productcontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const productValidation = require("../validations/product");

router.get(
  "/",
  productcontroller.getAllProducts
);

router.get(
  "/:id",
  productcontroller.getProductById
);

router.post(
  "/",
  validate(productValidation.createProduct),
  auth("manageProduct"),
  productcontroller.createProduct
);

router.patch(
  "/:id",
  validate(productValidation.updateProduct),
  auth("manageProduct"),
  productcontroller.updateProductById
);

router.delete(
  "/:id",
  auth("manageProduct"),
  productcontroller.deleteProductById
);

module.exports = router;