const orderService = require('../services/order.service');
const { updateLoyaltyPoints } = require("../services/user.service");

// Tạo đơn hàng đơn giản
const createOrder = async (req, res) => {
    try {
        const newOrder = await orderService.createOrder(req.body);
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

// Tạo đơn hàng đầy đủ (có sản phẩm, vé, gửi mail, xuất PDF)
const createOrders = async (req, res) => {
    try {
        const result = await orderService.createOrders(req.body);
        if (result?.error) {
            return res.status(409).json({ error: { message: result.error } });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=hoadon_${result.ordercode}.pdf`);
        res.end(result.pdfBuffer);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const ordersWithDetails = await orderService.getAllOrders();
        return res.status(200).json(ordersWithDetails);
    } catch (error) {
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderDetail = await orderService.getOrderById(req.params.id);
        if (!orderDetail) {
            return res.status(404).json({ error: { message: "Order not found!" } });
        }
        return res.status(200).json(orderDetail);
    } catch (error) {
        console.error("Server Error :", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getOrderByCode = async (req, res) => {
    try {
        const result = await orderService.getOrderByCode(req.params.ordercode);
        if (!result) {
            return res.status(404).json({ error: { message: "Order not found!" } });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=hoadon_${result.ordercode}.pdf`);
        res.end(result.pdfBuffer);
    } catch (error) {
        console.error("Server Error :", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getOrderWithInfoById = async (req, res) => {
    try {
        const result = await orderService.getOrderWithInfoById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: { message: 'Order not found!' } });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getOrderByUserId = async (req, res) => {
    try {
        const result = await orderService.getOrderByUserId(req.params.userid);
        // if (!result) {
        //     return res.status(404).json({ error: { message: "Order not found!" } });
        // }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Server Error :", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderService.deleteOrderById(orderId);
        if (!order) {
            return res.status(404).json({ error: { message: "Order not found!" } });
        }

        const points = await updateLoyaltyPoints(order.user_id._id, -order.amount);

        return res.status(200).json({
            minus_points: points,
            message: "Delete order, tickets and order details successfully!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteOrderByUserId = async (req, res) => {
    try {
        const result = await orderService.deleteOrderByUserId(req.params.userid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "No orders found to delete!" } });
        }
        return res.status(200).send(`${result.deletedCount} orders have been deleted.`);
    } catch (error) {
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const updateOrderById = async (req, res) => {
    try {
        const result = await orderService.updateOrderById(req.params.id, req.body);

        if (result.error) {
            const status = result.error === "Order not found!" ? 404 : 400;
            return res.status(status).json({ error: { message: result.error } });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

module.exports = {
    createOrder,
    createOrders,
    getOrderById,
    getAllOrders,
    getOrderByCode,
    getOrderWithInfoById,
    getOrderByUserId,
    deleteOrderById,
    deleteOrderByUserId,
    updateOrderById
};