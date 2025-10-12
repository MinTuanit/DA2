const express = require("express");
const router = express.Router();
const recommendController = require("../controllers/recommendcontroller");

router.get("/genre/:userId", recommendController.getRecommendationsByGenre);
router.get("/country/:userId", recommendController.getRecommendationsByCountry);

module.exports = router;