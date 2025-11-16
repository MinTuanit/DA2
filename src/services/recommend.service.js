const Ticket = require("../models/ticket");
const Order = require("../models/order");
const Showtime = require("../models/showtime");
const Movie = require("../models/movie");
const Room = require("../models/room");

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

// Thống kê khung giờ đông khách nhất trong khoảng ngày
async function getPopularTimeSlots(startDate, endDate) {
  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : new Date();

  const tickets = await Ticket.find()
    .populate({
      path: "showtime_id",
      select: "showtime"
    });

  const slotCount = {};
  tickets.forEach(ticket => {
    const showtime = ticket.showtime_id?.showtime;
    if (showtime && showtime >= start && showtime <= end) {
      const hour = showtime.getHours();
      slotCount[hour] = (slotCount[hour] || 0) + 1;
    }
  });

  const sortedSlots = Object.entries(slotCount)
    .sort((a, b) => b[1] - a[1])
    .map(([hour, count]) => ({ hour: Number(hour), count }));

  return sortedSlots; // [{ hour: 18, count: 120 }, ...]
}

// Các khung giờ cố định
const TIME_SLOTS = [
  "09:00", "12:00", "15:00", "18:00", "21:00"
];

async function getTopMoviesByRevenue14Days(limit = 10, date = new Date()) {
  const fourteenDaysAgo = new Date(date.getTime() - 14 * 24 * 60 * 60 * 1000);

  const revenue = await Ticket.aggregate([
    {
      $lookup: {
        from: "showtimes",
        localField: "showtime_id",
        foreignField: "_id",
        as: "showtime"
      }
    },
    { $unwind: "$showtime" },
    {
      $match: {
        "showtime.showtime": { $gte: fourteenDaysAgo, $lte: date }
      }
    },
    {
      $group: {
        _id: "$showtime.movie_id",
        totalRevenue: { $sum: "$price" }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit }
  ]);

  const movieIds = revenue.map(r => r._id);
  const movies = await Movie.find({ _id: { $in: movieIds }, status: { $in: ["Now Playing", "Coming Soon"] } });
  return movieIds.map(id => movies.find(m => m._id.equals(id))).filter(Boolean);
}

async function suggestShowtimesForManager(date) {
  let movies = await getTopMoviesByRevenue14Days(5, new Date(date));
  if (!movies.length) {
    movies = await Movie.find({ status: { $in: ["Now Playing", "Coming Soon"] } })
      .sort({ rating: -1 })
      .limit(10);
  }
  const rooms = await Room.find();

  // Lấy khung giờ phổ biến nhất trong 30 ngày gần nhất
  const startDate = new Date(new Date(date).getTime() - 30 * 24 * 60 * 60 * 1000);
  const endDate = new Date(date);
  const popularSlots = await getPopularTimeSlots(startDate, endDate);
  // Lấy tối đa 5 khung giờ phổ biến nhất, chuyển về dạng "HH:00"
  const SLOTS = popularSlots.slice(0, 5).map(s => `${s.hour.toString().padStart(2, "0")}:00`);
  if (!SLOTS.length) {
    // fallback nếu không có dữ liệu, dùng TIME_SLOTS mặc định
    SLOTS.push(...["09:00", "12:00", "15:00", "18:00", "21:00"]);
  }

  // Lấy tất cả showtime đã có trong ngày để tránh trùng lặp
  const existShowtimes = await Showtime.find({
    showtime: {
      $gte: new Date(`${date}T00:00:00`),
      $lt: new Date(`${date}T23:59:59`)
    }
  });

  const used = new Set(
    existShowtimes.map(s => `${s.room_id}_${s.showtime.getHours()}`)
  );

  const suggestions = [];
  let movieIdx = 0;

  for (const slot of SLOTS) {
    for (const room of rooms) {
      const showtimeDate = new Date(`${date}T${slot}:00`);
      const key = `${room._id}_${showtimeDate.getHours()}`;
      if (used.has(key)) continue;

      const movie = movies[movieIdx % movies.length];
      suggestions.push({
        movie_id: movie._id,
        movie_title: movie.title,
        room_id: room._id,
        room_name: room.name,
        showtime: showtimeDate
      });
      used.add(key);
      movieIdx++;
    }
  }

  return {
    topMovies: movies.map(m => ({ _id: m._id, title: m.title })),
    suggestions
  };
}

module.exports = {
  getUserWatchedMovies,
  getRecommendationsByUser,
  getRecommendedMoviesByCountry,
  suggestShowtimesForManager,
  getPopularTimeSlots
};