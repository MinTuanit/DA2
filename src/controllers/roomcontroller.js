const roomService = require('../services/room.service');

const createRoom = async (req, res) => {
    try {
        const room = await roomService.createRoom(req.body);
        return res.status(201).json(room);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const createRoomWithSeats = async (req, res) => {
    try {
        const result = await roomService.createRoomWithSeats(req.body);
        if (result?.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        return res.status(200).json(rooms);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getRoomById = async (req, res) => {
    try {
        const room = await roomService.getRoomById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: { message: "Phòng chiếu không tồn tại" } });
        }
        return res.status(200).json(room);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getRoomByCinemaId = async (req, res) => {
    try {
        const rooms = await roomService.getRoomByCinemaId(req.params.cinemaid);
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ error: { message: "Không có phòng trong rạp này" } });
        }
        return res.status(200).json(rooms);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteRoomById = async (req, res) => {
    try {
        const result = await roomService.deleteRoomById(req.params.id);
        if (result?.error) {
            return res.status(404).json({ error: { message: result.error } });
        }
        return res.status(200).json({ message: "Xóa phòng chiếu thành công" });
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const updateRoomWithSeatsById = async (req, res) => {
    try {
        const result = await roomService.updateRoomWithSeatsById(req.params.id, req.body);
        if (result?.error) {
            return res.status(404).json({ error: { message: result.error } });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

module.exports = {
    createRoom,
    createRoomWithSeats,
    getAllRooms,
    getRoomById,
    getRoomByCinemaId,
    deleteRoomById,
    updateRoomWithSeatsById
};