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

async function suggestSeats(showtime_id, numPeople) {
  // Lấy thông tin suất chiếu và phòng
  const showtime = await Showtime.findById(showtime_id).populate("room_id");
  if (!showtime) throw new Error("Showtime not found");

  // Lấy toàn bộ ghế của phòng chiếu
  const seats = await Seat.find({ room_id: showtime.room_id._id }).lean();

  // Lấy danh sách ghế đã đặt
  const bookedTickets = await Ticket.find({ showtime_id }).select("seat_id");
  const bookedSeatIds = bookedTickets.map(t => t.seat_id.toString());

  // Đánh dấu available
  const availableSeats = seats.map(seat => ({
    ...seat,
    available: !bookedSeatIds.includes(seat._id.toString())
  }));

  // Gom ghế theo hàng (ký tự đầu)
  const groupedByRow = {};
  for (const seat of availableSeats) {
    const row = seat.seat_name[0];
    if (!groupedByRow[row]) groupedByRow[row] = [];
    groupedByRow[row].push(seat);
  }

  // Duyệt từng hàng tìm cụm ghế trống liên tiếp
  for (const row of Object.keys(groupedByRow)) {
    const rowSeats = groupedByRow[row]
      .filter(s => s.available)
      .sort((a, b) => a.seat_column - b.seat_column);

    let consecutive = [];
    for (let i = 0; i < rowSeats.length; i++) {
      if (
        consecutive.length === 0 ||
        rowSeats[i].seat_column === rowSeats[i - 1].seat_column + 1
      ) {
        consecutive.push(rowSeats[i]);
      } else {
        consecutive = [rowSeats[i]];
      }

      if (consecutive.length === parseInt(numPeople)) {
        return consecutive; //trả về nhóm ghế phù hợp
      }
    }
  }

  //Không tìm thấy ghế phù hợp
  return [];
};

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
  deleteSeatByRoomId,
  suggestSeats
};