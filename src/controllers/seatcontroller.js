const seatService = require('../services/seat.service');

const createSeat = async (req, res) => {
    try {
        const seat = await seatService.createSeat(req.body);
        return res.status(201).json(seat);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const createSeats = async (req, res) => {
    try {
        const result = await seatService.createSeats(req.body);
        if (result?.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const resetSeats = async (req, res) => {
    try {
        const result = await seatService.resetSeats(req.body);
        if (result?.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi reset ghế:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getAllSeats = async (req, res) => {
    try {
        const seats = await seatService.getAllSeats();
        return res.status(200).json(seats);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getSeatById = async (req, res) => {
    try {
        const seat = await seatService.getSeatById(req.params.id);
        if (!seat) {
            return res.status(404).json({ error: { message: "Ghế không tồn tại" } });
        }
        return res.status(200).json(seat);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getSeatByRoomId = async (req, res) => {
    try {
        const seats = await seatService.getSeatByRoomId(req.params.roomid);
        if (!seats.length) {
            return res.status(404).json({ error: { message: "Không có ghế trong phòng này" } });
        }
        return res.status(200).json(seats);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getSeatByShowtimeId = async (req, res) => {
    try {
        const result = await seatService.getSeatByShowtimeId(req.params.showtimeid);
        if (result?.error) {
            return res.status(404).json({ error: { message: result.error } });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteSeatById = async (req, res) => {
    try {
        const seat = await seatService.deleteSeatById(req.params.id);
        if (!seat) {
            return res.status(404).json({ error: { message: "Ghế không tồn tại" } });
        }
        return res.status(200).json({ message: "Xóa ghế thành công" });
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteSeatByRoomId = async (req, res) => {
    try {
        const result = await seatService.deleteSeatByRoomId(req.params.roomid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "Không có ghế nào được tìm thấy để xóa" } });
        }
        return res.status(200).json({ message: `${result.deletedCount} ghế đã được xóa.` });
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const updateSeatById = async (req, res) => {
    try {
        const seat = await seatService.updateSeatById(req.params.id, req.body);
        if (!seat) {
            return res.status(404).json({ error: { message: "Ghế không tồn tại" } });
        }
        return res.status(200).json(seat);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
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
    deleteSeatByRoomId
};