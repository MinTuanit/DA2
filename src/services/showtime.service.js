const ShowTime = require("../models/showtime");
const Movie = require("../models/movie");
const Setting = require("../models/constraint");
const { parseTimeToDate } = require('../utils/parseTimeToDate');

async function createShowTime(data) {
  const { movie_id, showtime, price, room_id } = data;

  const setting = await Setting.findOne();
  if (!setting) return { error: "Không tìm thấy cài đặt hệ thống." };

  const { min_ticket_price, max_ticket_price, time_gap, open_time, close_time } = setting;
  if (price < min_ticket_price || price > max_ticket_price) {
    return { error: `Giá vé phải nằm trong khoảng từ ${min_ticket_price} đến ${max_ticket_price}.` };
  }

  const movie = await Movie.findById(movie_id);
  if (!movie) return { error: "Movie không tồn tại." };

  const duration = movie.duration;
  const newStart = new Date(showtime);
  const newEnd = new Date(newStart);
  newEnd.setMinutes(newEnd.getMinutes() + duration);

  const openTimeDate = parseTimeToDate(newStart, open_time);
  const closeTimeDate = parseTimeToDate(newStart, close_time);
  if (closeTimeDate <= openTimeDate) closeTimeDate.setDate(closeTimeDate.getDate() + 1);

  if (newStart < openTimeDate || newEnd > closeTimeDate) {
    return { error: `Lịch chiếu phải nằm trong khoảng từ ${open_time} đến ${close_time}` };
  }

  const existingShowtimes = await ShowTime.find({
    room_id,
    showtime: { $lt: newEnd }
  }).populate('movie_id');

  const isOverlapping = existingShowtimes.some(existing => {
    const existingStart = new Date(existing.showtime);
    const existingDuration = existing.movie_id?.duration || 0;
    const existingEnd = new Date(existingStart);
    existingEnd.setMinutes(existingEnd.getMinutes() + existingDuration + time_gap);
    return newStart < existingEnd && newEnd > existingStart;
  });

  if (isOverlapping) {
    return { error: "Lịch chiếu bị trùng với lịch chiếu khác trong phòng hoặc không đủ thời gian dọn dẹp." };
  }

  const newShowtime = new ShowTime({
    showtime: newStart,
    price,
    movie_id,
    room_id
  });

  await newShowtime.save();
  return newShowtime;
}

async function getAllShowTimes() {
  const showtimes = await ShowTime.find()
    .populate({ path: "movie_id", select: "title", strictPopulate: false })
    .populate({ path: "room_id", select: "name", strictPopulate: false });

  const filteredShowtimes = showtimes.filter(s => s.movie_id && s.room_id);
  return filteredShowtimes.map(s => ({
    _id: s._id,
    showtime: s.showtime,
    price: s.price,
    movie: { movie_id: s.movie_id._id, title: s.movie_id.title },
    room: { room_id: s.room_id._id, name: s.room_id.name }
  }));
}

async function getShowTimeById(id) {
  const s = await ShowTime.findById(id)
    .populate({ path: "movie_id", select: "title" })
    .populate({ path: "room_id", select: "name" });

  if (!s) return null;

  return {
    _id: s._id,
    showtime: s.showtime,
    price: s.price,
    movie: { movie_id: s.movie_id._id, title: s.movie_id.title },
    room: { room_id: s.room_id._id, name: s.room_id.name }
  };
}

async function getShowTimeByMovieId(movieid) {
  const showtimes = await ShowTime.find({ movie_id: movieid })
    .populate({ path: "movie_id", select: "title", strictPopulate: false })
    .populate({ path: "room_id", select: "name", strictPopulate: false });

  const filtered = showtimes.filter(s => s.movie_id && s.room_id);
  return filtered.map(s => ({
    _id: s._id,
    showtime: s.showtime,
    price: s.price,
    movie: { movie_id: s.movie_id._id, title: s.movie_id.title },
    room: { room_id: s.room_id._id, name: s.room_id.name }
  }));
}

async function getCurrentShowtime() {
  const now = new Date();

  const movies = await Movie.aggregate([
    { $match: { status: { $in: ['Now Playing', 'Coming Soon'] } } },
    {
      $lookup: {
        from: 'showtimes',
        localField: '_id',
        foreignField: 'movie_id',
        as: 'showtimes'
      }
    },
    {
      $addFields: {
        showtimes: {
          $filter: {
            input: '$showtimes',
            as: 'showtime',
            cond: { $gt: ['$$showtime.showtime', now] }
          }
        }
      }
    }
  ]);

  return movies;
}

async function deleteShowTimeById(id) {
  return await ShowTime.findByIdAndDelete(id);
}

async function updateShowTimeById(id, data) {
  const { showtime, price, room_id } = data;
  const movie_id = data.movie?.movie_id || data.movie_id;

  const setting = await Setting.findOne();
  if (!setting) return { error: "Không tìm thấy cài đặt hệ thống." };

  const { min_ticket_price, max_ticket_price, time_gap, open_time, close_time } = setting;
  if (price < min_ticket_price || price > max_ticket_price) {
    return { error: `Giá vé phải nằm trong khoảng từ ${min_ticket_price} đến ${max_ticket_price}.` };
  }

  const movie = await Movie.findById(movie_id);
  if (!movie) return { error: "Movie không tồn tại." };

  const duration = movie.duration;
  const newStart = new Date(showtime);
  const newEnd = new Date(newStart);
  newEnd.setMinutes(newEnd.getMinutes() + duration);

  const openTimeDate = parseTimeToDate(newStart, open_time);
  let closeTimeDate = parseTimeToDate(newStart, close_time);
  if (closeTimeDate <= openTimeDate) closeTimeDate.setDate(closeTimeDate.getDate() + 1);

  if (newStart < openTimeDate || newEnd > closeTimeDate) {
    return { error: `Lịch chiếu phải nằm trong khoảng từ ${open_time} đến ${close_time}` };
  }

  const existingShowtimes = await ShowTime.find({
    _id: { $ne: id },
    room_id,
    showtime: { $lt: newEnd }
  }).populate('movie_id');

  const isOverlapping = existingShowtimes.some(existing => {
    const existingStart = new Date(existing.showtime);
    const existingDuration = existing.movie_id?.duration || 0;
    const existingEnd = new Date(existingStart);
    existingEnd.setMinutes(existingEnd.getMinutes() + existingDuration + time_gap);
    return newStart < existingEnd && newEnd > existingStart;
  });

  if (isOverlapping) {
    return { error: "Lịch chiếu bị trùng với lịch khác hoặc không đủ thời gian dọn dẹp." };
  }

  const updated = await ShowTime.findByIdAndUpdate(
    id,
    { showtime: newStart, price, movie_id, room_id },
    { new: true }
  );

  if (!updated) return null;
  return updated;
}

module.exports = {
  createShowTime,
  getAllShowTimes,
  getShowTimeById,
  getShowTimeByMovieId,
  getCurrentShowtime,
  deleteShowTimeById,
  updateShowTimeById
};