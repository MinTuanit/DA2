const roomService = require('../services/room.service');

const createRoom = async (req, res) => {
    try {
        const room = await roomService.createRoom(req.body);
        return res.status(201).json(room);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        return res.status(200).json(rooms);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getRoomById = async (req, res) => {
    try {
        const room = await roomService.getRoomById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: { message: "Room not found!" } });
        }
        return res.status(200).json(room);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getRoomByCinemaId = async (req, res) => {
    try {
        const rooms = await roomService.getRoomByCinemaId(req.params.cinemaid);
        // if (!rooms || rooms.length === 0) {
        //     return res.status(404).json({ error: { message: "No room for this cinema!" } });
        // }
        return res.status(200).json(rooms);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteRoomById = async (req, res) => {
    try {
        const result = await roomService.deleteRoomById(req.params.id);
        if (result?.error) {
            return res.status(404).json({ error: { message: result.error } });
        }
        return res.status(200).json({ message: "Delete room successfully." });
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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