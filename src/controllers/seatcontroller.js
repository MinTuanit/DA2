const seatService = require('../services/seat.service');

const createSeat = async (req, res) => {
    try {
        const seat = await seatService.createSeat(req.body);
        return res.status(201).json(seat);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllSeats = async (req, res) => {
    try {
        const seats = await seatService.getAllSeats();
        return res.status(200).json(seats);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getSeatById = async (req, res) => {
    try {
        const seat = await seatService.getSeatById(req.params.id);
        if (!seat) {
            return res.status(404).json({ error: { message: "Seat not found!" } });
        }
        return res.status(200).json(seat);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getSeatByRoomId = async (req, res) => {
    try {
        const seats = await seatService.getSeatByRoomId(req.params.roomid);
        // if (!seats.length) {
        //     return res.status(404).json({ error: { message: "No seat for this room!" } });
        // }
        return res.status(200).json(seats);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteSeatById = async (req, res) => {
    try {
        const seat = await seatService.deleteSeatById(req.params.id);
        if (!seat) {
            return res.status(404).json({ error: { message: "Seat not found!" } });
        }
        return res.status(200).json({ message: "Delete seat successfully." });
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteSeatByRoomId = async (req, res) => {
    try {
        const result = await seatService.deleteSeatByRoomId(req.params.roomid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "No seat to delete!" } });
        }
        return res.status(200).json({ message: `${result.deletedCount} seats have been deleted.` });
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error" } });
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