const Seat = require("../models/seat");
const Showtime = require("../models/showtime");
const Ticket = require("../models/ticket");

async function createSeat(data) {
  return await Seat.create(data);
}

async function createSeats(seatsData) {
  if (!Array.isArray(seatsData)) {
    return { error: "The data sent must be an array of seats." };
  }
  return await Seat.insertMany(seatsData);
}

async function resetSeats({ room_id, seats }) {
  if (!room_id || !Array.isArray(seats)) {
    return { error: "Missing room_id or list seat!" };
  }
  await Seat.deleteMany({ room_id });
  return await Seat.insertMany(seats);
}

async function getAllSeats() {
  return await Seat.find();
}

async function getSeatById(id) {
  return await Seat.findById(id);
}

async function getSeatByRoomId(roomid) {
  return await Seat.find({ room_id: roomid });
}

async function getSeatByShowtimeId(showtimeid) {
  const showtime = await Showtime.findById(showtimeid);
  if (!showtime) return { error: "No matching movie showtimes found!" };
  const seats = await Seat.find({ room_id: showtime.room_id });
  const bookedTickets = await Ticket.find({ showtime_id: showtimeid }).select("seat_id");
  const bookedSeatIds = bookedTickets.map(ticket => ticket.seat_id.toString());
  return seats.map(seat => ({
    ...seat.toObject(),
    available: !bookedSeatIds.includes(seat._id.toString())
  }));
}

async function deleteSeatById(id) {
  return await Seat.findByIdAndDelete(id);
}

async function deleteSeatByRoomId(roomid) {
  return await Seat.deleteMany({ room_id: roomid });
}

async function updateSeatById(id, data) {
  return await Seat.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  createSeat,
  createSeats,
  resetSeats,
  getAllSeats,
  getSeatById,
  getSeatByRoomId,
  getSeatByShowtimeId,
  updateSeatById,
  deleteSeatById,
  deleteSeatByRoomId
};