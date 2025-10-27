const ticketService = require('../services/ticket.service');

const createTicket = async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(req.body);
        return res.status(201).json(ticket);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getAllTickets();
        return res.status(200).json(tickets);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: { message: "Ticker not found!" } });
        }
        return res.status(200).json(ticket);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getTicketByUserId = async (req, res) => {
    try {
        const tickets = await ticketService.getTicketByUserId(req.params.userid);
        // if (!tickets || tickets.length === 0) {
        //     return res.status(404).json({ error: { message: "This user has no tickets!" } });
        // }
        return res.status(200).json(tickets);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.deleteTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: { message: "Ticker not found!" } });
        }
        return res.status(200).json({ message: "Delete ticket successfully." });
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteTicketByOrderId = async (req, res) => {
    try {
        const result = await ticketService.deleteTicketByOrderId(req.params.orderid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "No tickets found to delete!" } });
        }
        return res.status(200).json({ message: `${result.deletedCount} tickets have been deleted.` });
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteTicketByShowTimeId = async (req, res) => {
    try {
        const result = await ticketService.deleteTicketByShowTimeId(req.params.showtimeid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "No tickets found to delete!" } });
        }
        return res.status(200).json({ message: `${result.deletedCount} tickets have been deleted.` });
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const updateTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.updateTicketById(req.params.id, req.body);
        if (!ticket) {
            return res.status(404).json({ error: { message: "Ticket not found!" } });
        }
        return res.status(200).json(ticket);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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