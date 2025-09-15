const revenueService = require('../services/revenue.service');

const getAll = async (req, res) => {
    try {
        const result = await revenueService.getAllRevenue();
        return res.status(200).json(result);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: { message: "Date not valid!" } });
        }
        const result = await revenueService.getAllRevenueReport({ startDate, endDate });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate, movie_id, product_id } = req.body;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: { message: "Date not valid!" } });
        }
        const result = await revenueService.getRevenueReport({ startDate, endDate, movie_id, product_id });
        if (result?.error) {
            return res.status(404).json({ error: { message: result.error } });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getDailyTicketRevenueByMovie = async (req, res) => {
    try {
        const { movie_id, startDate, endDate } = req.body;
        if (!movie_id || !startDate || !endDate) {
            return res.status(400).json({ error: { message: "Missing movie_id or time!" } });
        }
        const result = await revenueService.getDailyTicketRevenueByMovie({ movie_id, startDate, endDate });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getDailyProductSalesByProduct = async (req, res) => {
    try {
        const { product_id, startDate, endDate } = req.body;
        if (!product_id || !startDate || !endDate) {
            return res.status(400).json({ error: { message: "Missing product_id or time!" } });
        }
        const result = await revenueService.getDailyProductSalesByProduct({ product_id, startDate, endDate });
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
    getAll,
    getRevenueReport,
    getAllRevenueReport,
    getDailyTicketRevenueByMovie,
    getDailyProductSalesByProduct
};