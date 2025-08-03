const showtimeService = require('../services/showtime.service');

const createShowTime = async (req, res) => {
    try {
        const result = await showtimeService.createShowTime(req.body);
        if (result?.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getAllShowTimes = async (req, res) => {
    try {
        const showtimes = await showtimeService.getAllShowTimes();
        return res.status(200).json(showtimes);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getShowTimeById = async (req, res) => {
    try {
        const showtime = await showtimeService.getShowTimeById(req.params.id);
        if (!showtime) {
            return res.status(404).json({ error: { message: "Không tìm thấy suất chiếu" } });
        }
        return res.status(200).json(showtime);
    } catch (error) {
        console.error("Lỗi khi lấy showtime:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getShowTimeByMovieId = async (req, res) => {
    try {
        const showtimes = await showtimeService.getShowTimeByMovieId(req.params.movieid);
        if (!showtimes || showtimes.length === 0) {
            return res.status(404).json({ error: { message: "Không có lịch chiếu của phim này!" } });
        }
        return res.status(200).json(showtimes);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getCurrentShowtime = async (req, res) => {
    try {
        const movies = await showtimeService.getCurrentShowtime();
        return res.status(200).json({ data: movies });
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteShowTimeById = async (req, res) => {
    try {
        const showtime = await showtimeService.deleteShowTimeById(req.params.id);
        if (!showtime) {
            return res.status(404).json({ error: { message: "Lịch chiếu phim không tồn tại" } });
        }
        return res.status(204).send();
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const updateShowTimeById = async (req, res) => {
    try {
        const result = await showtimeService.updateShowTimeById(req.params.id, req.body);
        if (result?.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        if (!result) {
            return res.status(404).json({ error: { message: "Lịch chiếu phim không tồn tại" } });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

module.exports = {
    createShowTime,
    updateShowTimeById,
    getAllShowTimes,
    deleteShowTimeById,
    getShowTimeById,
    getShowTimeByMovieId,
    getCurrentShowtime
};