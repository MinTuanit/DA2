const Ticket = require("../models/ticket");
const Order = require("../models/order");
const Showtime = require("../models/showtime");
const Movie = require("../models/movie");

async function getUserWatchedMovies(userId) {
  const orders = await Order.find({ user_id: userId }).select("_id");
  if (!orders.length) return [];

  const orderIds = orders.map(o => o._id);

  const tickets = await Ticket.find({ order_id: { $in: orderIds } })
    .populate({
      path: "showtime_id",
      populate: { path: "movie_id" }
    });

  // Lọc ra các phim đã xem
  return tickets
    .map(t => t.showtime_id?.movie_id)
    .filter(Boolean);
}

async function getRecommendationsByUser(userId) {
  const watchedMovies = await getUserWatchedMovies(userId);

  // Nếu user chưa xem phim → trả về top 10 phim có rating cao nhất
  if (!watchedMovies.length) {
    return await Movie.find().sort({ rating: -1 }).limit(10);
  }

  // Lấy danh sách thể loại user đã xem
  const genres = [
    ...new Set(
      watchedMovies
        .flatMap(movie => movie.genre || [])
        .filter(Boolean)
    )
  ];

  // Lấy danh sách ID phim đã xem
  const watchedIds = watchedMovies.map(m => m._id);

  // Gợi ý phim khác cùng thể loại
  const recommended = await Movie.find({
    _id: { $nin: watchedIds },
    genre: { $in: genres }
  })
    .sort({ rating: -1 })
    .limit(10);

  return recommended;
}

async function getRecommendedMoviesByCountry(userId) {
  const watchedMovies = await getUserWatchedMovies(userId);
  if (!watchedMovies.length) return [];

  const countries = [
    ...new Set(
      watchedMovies
        .map(movie => movie.country)
        .filter(Boolean)
    )
  ];

  const recommended = await Movie.find({
    country: { $in: countries },
    _id: { $nin: watchedMovies.map(m => m._id) }
  })
    .sort({ rating: -1 })
    .limit(10);

  return recommended;
}

module.exports = {
  getUserWatchedMovies,
  getRecommendationsByUser,
  getRecommendedMoviesByCountry
};