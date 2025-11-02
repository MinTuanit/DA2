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

async function getLastTwoWatchedMovies(userId) {
  // Lấy các đơn hàng gần nhất
  const orders = await Order.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .select("_id")
    .limit(5);

  if (!orders.length) return [];

  const orderIds = orders.map(o => o._id);

  // Lấy 2 vé gần nhất (sắp xếp theo thời gian)
  const tickets = await Ticket.find({ order_id: { $in: orderIds } })
    .sort({ createdAt: -1 })
    .limit(2)
    .populate({
      path: "showtime_id",
      populate: { path: "movie_id", select: "_id genre" }
    });

  // Trích xuất danh sách phim (chỉ lấy _id, genre)
  return tickets
    .map(t => t.showtime_id?.movie_id)
    .filter(Boolean);
}

async function getRecommendationsByUser(userId) {
  const recentMovies = await getLastTwoWatchedMovies(userId);

  // Nếu user chưa xem phim nào → lấy top 5 phim theo rating (phim đang chiếu hoặc sắp chiếu)
  if (!recentMovies.length) {
    const topMovies = await Movie.find({ status: { $in: ["Now Playing", "Coming Soon"] } })
      .sort({ rating: -1 })
      .limit(5)
      .select("_id");
    return topMovies.map(m => m._id);
  }

  // Lấy danh sách thể loại của 2 phim gần nhất
  const genres = [
    ...new Set(
      recentMovies.flatMap(movie => movie.genre || []).filter(Boolean)
    )
  ];

  // Lấy danh sách ID phim đã xem
  const watchedIds = recentMovies.map(m => m._id);

  // Gợi ý phim khác cùng thể loại (phim đang chiếu hoặc sắp chiếu)
  const recommendations = await Movie.find({
    _id: { $nin: watchedIds },
    genre: { $in: genres },
    status: { $in: ["Now Playing", "Coming Soon"] }
  })
    .sort({ rating: -1 })
    .limit(5)
    .select("_id");

  // Trả về danh sách ID phim
  return recommendations.map(m => m._id);
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
    _id: { $nin: watchedMovies.map(m => m._id) },
    status: { $in: ["Now Playing", "Coming Soon"] }
  })
    .sort({ rating: -1 })
    .limit(5);

  return recommended;
}

module.exports = {
  getUserWatchedMovies,
  getRecommendationsByUser,
  getRecommendedMoviesByCountry
};