const router = require("express").Router();
const reviewcontroller = require("../controllers/reviewcontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const reviewValidation = require("../validations/review");

router.get(
  "/",
  reviewcontroller.getAllReviews
);

router.get(
  "/unverified",
  reviewcontroller.getAllUnverifiedReviews
);

router.get(
  "/userinfo/:reviewid",
  auth("getReview"),
  reviewcontroller.getReviewWithUserInfo
);

router.get(
  "/movie",
  reviewcontroller.getReviewByMovieId
);

router.get(
  "/:id",
  reviewcontroller.getReviewById
);

router.post(
  "/",
  auth("getReview"),
  validate(reviewValidation.createReview),
  reviewcontroller.createReview
);

router.patch(
  "/:id",
  auth("getReview"),
  validate(reviewValidation.updateReview),
  reviewcontroller.updateReviewById
);

router.delete(
  "/movie/:movieid",
  auth("managerReview"),
  reviewcontroller.deleteReviewByMovieId
);

router.delete(
  "/:id",
  auth("getReview"),
  reviewcontroller.deleteReviewById
);

module.exports = router;