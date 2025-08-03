const ticketService = require('../services/ticket.service');

const createTicket = async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(req.body);
        return res.status(201).json(ticket);
    } catch (error) {
        console.error("Lỗi server!", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getAllTickets();
        return res.status(200).json(tickets);
    } catch (error) {
        console.error("Lỗi server!", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: { message: "Không tìm thấy vé" } });
        }
        return res.status(200).json(ticket);
    } catch (error) {
        console.error("Lỗi khi lấy vé:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getTicketByUserId = async (req, res) => {
    try {
        const tickets = await ticketService.getTicketByUserId(req.params.userid);
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ error: { message: "Người dùng này không có vé nào" } });
        }
        return res.status(200).json(tickets);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.deleteTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: { message: "Vé không tồn tại" } });
        }
        return res.status(200).json({ message: "Xóa vé thành công" });
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteTicketByOrderId = async (req, res) => {
    try {
        const result = await ticketService.deleteTicketByOrderId(req.params.orderid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "Không có vé nào được tìm thấy để xóa" } });
        }
        return res.status(200).json({ message: `${result.deletedCount} vé đã được xóa.` });
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteTicketByShowTimeId = async (req, res) => {
    try {
        const result = await ticketService.deleteTicketByShowTimeId(req.params.showtimeid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "Không có vé nào được tìm thấy để xóa" } });
        }
        return res.status(200).json({ message: `${result.deletedCount} vé đã được xóa.` });
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const updateTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.updateTicketById(req.params.id, req.body);
        if (!ticket) {
            return res.status(404).json({ error: { message: "Vé không tồn tại" } });
        }
        return res.status(200).json(ticket);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

module.exports = {
    createTicket,
    updateTicketById,
    getAllTickets,
    deleteTicketById,
    getTicketById,
    getTicketByUserId,
    deleteTicketByOrderId,
    deleteTicketByShowTimeId
};