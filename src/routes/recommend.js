const express = require("express");
const router = express.Router();
const recommendController = require("../controllers/recommendcontroller");

router.get("/genre/:userId", recommendController.getRecommendationsByGenre);
router.get("/country/:userId", recommendController.getRecommendationsByCountry);
router.post("/suggest-showtimes", recommendController.suggestShowtimesForManager);
router.post("/popular-time-slots", recommendController.getPopularTimeSlots);

module.exports = router;