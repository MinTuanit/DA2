const Ticket = require("../models/ticket");

async function createTicket(data) {
  return await Ticket.create(data);
}

async function getAllTickets() {
  return await Ticket.find();
}

async function getTicketById(id) {
  const ticket = await Ticket.findById(id)
    .populate({
      path: "showtime_id",
      populate: [
        { path: "movie_id", select: "title" },
        { path: "room_id", select: "name" }
      ]
    })
    .populate({ path: "seat_id", select: "name" });

  if (!ticket) return null;

  const movie = ticket.showtime_id?.movie_id;
  const room = ticket.showtime_id?.room_id;
  const seat = ticket.seat_id;

  return {
    _id: ticket._id,
    order_id: ticket.order_id,
    movie: movie ? { movie_id: movie._id, title: movie.title } : null,
    room: room ? { room_id: room._id, name: room.name } : null,
    seat: seat ? { seat_id: seat._id, name: seat.name } : null
  };
}

async function getTicketByUserId(userid) {
  return await Ticket.find({ user_id: userid });
}

async function deleteTicketById(id) {
  return await Ticket.findByIdAndDelete(id);
}

async function deleteTicketByOrderId(orderid) {
  return await Ticket.deleteMany({ order_id: orderid });
}

async function deleteTicketByShowTimeId(showtimeid) {
  return await Ticket.deleteMany({ showtime_id: showtimeid });
}

async function updateTicketById(id, data) {
  return await Ticket.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  getTicketByUserId,
  deleteTicketById,
  deleteTicketByOrderId,
  deleteTicketByShowTimeId,
  updateTicketById
};