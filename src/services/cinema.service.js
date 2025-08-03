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

async function getEmployeeAndRoomById(cinema_id) {
  const [employeeCount, roomCount] = await Promise.all([
    Employee.countDocuments({ cinema_id }),
    Room.countDocuments({ cinema_id })
  ]);
  return { cinema_id, employeeCount, roomCount };
}

module.exports = {
  createCinema,
  getAllCinemas,
  getCinemaById,
  updateCinemaById,
  deleteCinemaById,
  getEmployeeAndRoomById
};