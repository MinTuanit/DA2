const Cinema = require("../models/cinema");
const Employee = require("../models/employee");
const Room = require("../models/room");

async function createCinema(data) {
  return await Cinema.create(data);
}

async function getAllCinemas() {
  return await Cinema.find();
}

async function getCinemaById(id) {
  return await Cinema.findById(id);
}

async function updateCinemaById(id, data) {
  return await Cinema.findByIdAndUpdate(id, data, { new: true });
}

async function deleteCinemaById(id) {
  return await Cinema.findByIdAndDelete(id);
}

async function getAllCinemasWithCounts() {
  const cinemas = await Cinema.find();

  const cinemaIds = cinemas.map(c => c._id);

  const employeeCounts = await Employee.aggregate([
    { $match: { cinema_id: { $in: cinemaIds } } },
    { $group: { _id: "$cinema_id", count: { $sum: 1 } } }
  ]);

  const roomCounts = await Room.aggregate([
    { $match: { cinema_id: { $in: cinemaIds } } },
    { $group: { _id: "$cinema_id", count: { $sum: 1 } } }
  ]);

  const employeeMap = new Map(employeeCounts.map(e => [e._id.toString(), e.count]));
  const roomMap = new Map(roomCounts.map(r => [r._id.toString(), r.count]));

  return cinemas.map(c => ({
    _id: c._id.toString(),
    name: c.name,
    address: c.address,
    employee_count: employeeMap.get(c._id.toString()) || 0,
    room_count: roomMap.get(c._id.toString()) || 0,
  }));
}

module.exports = {
  createCinema,
  getAllCinemas,
  getCinemaById,
  updateCinemaById,
  deleteCinemaById,
  getAllCinemasWithCounts
};