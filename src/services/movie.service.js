const Movie = require("../models/movie");

async function createMovie(data) {
  return await Movie.create(data);
}

async function getAllMovies() {
  return await Movie.find();
}

async function getMovieById(id) {
  return await Movie.findById(id);
}

async function getMovieByStatus(statusArr) {
  return await Movie.find({ status: { $in: statusArr } });
}

async function deleteMovieById(id) {
  return await Movie.findByIdAndDelete(id);
}

async function updateMovieById(id, data) {
  return await Movie.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  getMovieByStatus,
  deleteMovieById,
  updateMovieById
};