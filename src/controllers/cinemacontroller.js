const cinemaservice = require("../services/cinema.service");

const createCinema = async (req, res) => {
  try {
    const cinema = await cinemaservice.createCinema(req.body);
    return res.status(201).json(cinema);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const getAllCinemas = async (req, res) => {
  try {
    const cinemas = await cinemaservice.getAllCinemas();
    return res.status(200).json(cinemas);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const getCinemaById = async (req, res) => {
  try {
    const cinema = await cinemaservice.getCinemaById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ error: { message: "Cinema not found!" } });
    }
    return res.status(200).json(cinema);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const updateCinemaById = async (req, res) => {
  try {
    const cinema = await cinemaservice.updateCinemaById(req.params.id, req.body);
    if (!cinema) {
      return res.status(404).json({ error: { message: "Cinema not found!" } });
    }
    return res.status(200).json(cinema);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const deleteCinemaById = async (req, res) => {
  try {
    const cinema = await cinemaservice.deleteCinemaById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ error: { message: "Cinema not found!" } });
    }
    return res.status(200).json({ message: "Delete cinema successfully." });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const getAllCinemasWithCounts = async (req, res) => {
  try {
    const result = await cinemaservice.getAllCinemasWithCounts();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

module.exports = {
  createCinema,
  updateCinemaById,
  getCinemaById,
  getAllCinemas,
  deleteCinemaById,
  getAllCinemasWithCounts
};