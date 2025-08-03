const cinemaservice = require("../services/cinema.service");

const createCinema = async (req, res) => {
  try {
    const cinema = await cinemaservice.createCinema(req.body);
    return res.status(201).json(cinema);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ error: { message: "Lỗi Server" } });
  }
};

const getAllCinemas = async (req, res) => {
  try {
    const cinemas = await cinemaservice.getAllCinemas();
    return res.status(200).json(cinemas);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ error: { message: "Lỗi Server" } });
  }
};

const getCinemaById = async (req, res) => {
  try {
    const cinema = await cinemaservice.getCinemaById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ error: { message: "Không tìm thấy rạp chiếu phim." } });
    }
    return res.status(200).json(cinema);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ error: { message: "Lỗi Server" } });
  }
};

const updateCinemaById = async (req, res) => {
  try {
    const cinema = await cinemaservice.updateCinemaById(req.params.id, req.body);
    if (!cinema) {
      return res.status(404).json({ error: { message: "Rạp chiếu phim không tồn tại" } });
    }
    return res.status(200).json(cinema);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ error: { message: "Lỗi Server" } });
  }
};

const deleteCinemaById = async (req, res) => {
  try {
    const cinema = await cinemaservice.deleteCinemaById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ error: { message: "Rạp chiếu phim không tồn tại" } });
    }
    return res.status(200).json({ message: "Xóa rạp chiếu phim thành công" });
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ error: { message: "Lỗi Server" } });
  }
};

const getEmployeeAndRoomById = async (req, res) => {
  try {
    const result = await cinemaservice.getEmployeeAndRoomById(req.params.cinemaid);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ error: { message: "Lỗi server!" } });
  }
};

module.exports = {
  createCinema,
  updateCinemaById,
  getCinemaById,
  getAllCinemas,
  deleteCinemaById,
  getEmployeeAndRoomById
};