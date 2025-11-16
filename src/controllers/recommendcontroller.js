const recommendService = require("../services/recommend.service");

const getRecommendationsByGenre = async (req, res) => {
  try {
    const { userId } = req.params;
    const movies = await recommendService.getRecommendationsByUser(userId);

    res.status(200).json({
      success: true,
      //message: "Recommended movies by genre",
      data: movies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: err.message } });
  }
};

const getRecommendationsByCountry = async (req, res) => {
  try {
    const { userId } = req.params;
    const movies = await recommendService.getRecommendedMoviesByCountry(userId);

    res.status(200).json({
      success: true,
      //message: "Recommended movies by country",
      data: movies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: err.message } });
  }
};

const suggestShowtimesForManager = async (req, res) => {
  try {
    const { date } = req.body;
    const suggestions = await recommendService.suggestShowtimesForManager(date);
    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: err.message } });
  }
};

const getPopularTimeSlots = async (req, res) => {
  try {
    const { star_date, end_date } = req.body;
    const popularSlots = await recommendService.getPopularTimeSlots(star_date, end_date);
    res.status(200).json({
      success: true,
      data: popularSlots
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: err.message } });
  }
};

module.exports = {
  getRecommendationsByGenre,
  getRecommendationsByCountry,
  suggestShowtimesForManager,
  getPopularTimeSlots
};