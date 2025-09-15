const Room = require("../models/room");
const Seat = require("../models/seat");
const mongoose = require("mongoose");

async function createRoom(data) {
    return await Room.create(data);
}

async function createRoomWithSeats(data) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { cinema_id, name, seats } = data;
        if (!cinema_id) {
            await session.abortTransaction();
            session.endSession();
            return { error: "Missing cinema_id!" };
        }
        const room = new Room({
            name,
            seat_count: seats.length,
            cinema_id,
        });
        await room.save({ session });

        const seatDocs = seats.map(seat => ({
            seat_name: seat.seat_name,
            seat_column: seat.seat_column,
            room_id: room._id
        }));
        await Seat.insertMany(seatDocs, { session });

        await session.commitTransaction();
        session.endSession();

        return {
            message: "Create a successful room and seats",
            room_id: room._id,
            seats_created: seatDocs.length
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

async function getAllRooms() {
    const rooms = await Room.find().populate({
        path: "cinema_id",
        select: "name"
    });
    return rooms.map(room => ({
        _id: room._id,
        name: room.name,
        seat_count: room.seat_count,
        cinema: {
            cinema_id: room.cinema_id?._id,
            name: room.cinema_id?.name
        }
    }));
}

async function getRoomById(id) {
    return await Room.findById(id);
}

async function getRoomByCinemaId(cinemaid) {
    return await Room.find({ cinema_id: cinemaid });
}

async function deleteRoomById(id) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const room = await Room.findByIdAndDelete(id, { session });
        if (!room) {
            await session.abortTransaction();
            session.endSession();
            return { error: "Room not found!" };
        }
        await Seat.deleteMany({ room_id: id }, { session });
        await session.commitTransaction();
        session.endSession();
        return { message: "Delete room successfully." };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

async function updateRoomWithSeatsById(id, data) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, cinema_id, seats } = data;
        const room = await Room.findByIdAndUpdate(
            id,
            { name, cinema_id },
            { new: true, session }
        );
        if (!room) {
            await session.abortTransaction();
            session.endSession();
            return { error: "Room not found!" };
        }
        await Seat.deleteMany({ room_id: id }, { session });
        if (Array.isArray(seats) && seats.length > 0) {
            const seatDocs = seats.map(seat => ({
                seat_name: seat.seat_name,
                seat_column: seat.seat_column,
                room_id: id
            }));
            await Seat.insertMany(seatDocs, { session });
        }
        const seatCount = await Seat.countDocuments({ room_id: id }).session(session);
        room.seat_count = seatCount;
        await room.save({ session });
        await session.commitTransaction();
        session.endSession();
        return room;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

module.exports = {
    createRoom,
    createRoomWithSeats,
    getAllRooms,
    getRoomById,
    getRoomByCinemaId,
    deleteRoomById,
    updateRoomWithSeatsById
};