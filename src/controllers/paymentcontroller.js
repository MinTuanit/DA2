const paymentService = require('../services/payment.service');

const createPayment = async (req, res) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        return res.status(201).json(payment);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        if (!payments) {
            return res.status(404).json({ error: { message: "Không có thanh toán nào" } });
        }
        return res.status(200).json(payments);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        if (!payment) {
            return res.status(404).json({ error: { message: "Thanh toán không tồn tại" } });
        }
        return res.status(200).json(payment);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deletePaymentById = async (req, res) => {
    try {
        const payment = await paymentService.deletePaymentById(req.params.id);
        if (!payment) {
            return res.status(404).json({ error: { message: "Thanh toán không tồn tại" } });
        }
        return res.status(204).send();
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const updatePaymentById = async (req, res) => {
    try {
        const payment = await paymentService.updatePaymentById(req.params.id, req.body);
        if (!payment) {
            return res.status(404).json({ error: { message: "Thanh toán không tồn tại" } });
        }
        return res.status(200).json(payment);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    deletePaymentById,
    updatePaymentById
};