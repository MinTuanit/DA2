const router = require("express").Router();
const reviewcontroller = require("../controllers/reviewcontroller");
const auth = require("../middlewares/auth");

router.get("/userinfo/:reviewid", auth("getReview"), reviewcontroller.getReviewWithUserInfo);
router.get("/", reviewcontroller.getAllReviews);
router.get("/movie/:movieid", reviewcontroller.getReviewByMovieId);
router.get("/:id", reviewcontroller.getReviewById);
router.post("/", auth("getReview"), reviewcontroller.createReview);
router.patch("/:id", auth("getReview"), reviewcontroller.updateReviewById);
router.delete("/movie/:movieid", auth("managerReview"), reviewcontroller.deleteReviewByMovieId);
router.delete("/:id", auth("getReview"), reviewcontroller.deleteReviewById);

module.exports = router;