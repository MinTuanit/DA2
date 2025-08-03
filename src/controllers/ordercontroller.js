const orderService = require('../services/order.service');

// Tạo đơn hàng đơn giản
const createOrder = async (req, res) => {
    try {
        const newOrder = await orderService.createOrder(req.body);
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
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
        console.error("Lỗi khi tạo hóa đơn:", error);
        return res.status(500).json({ error: { message: "Lỗi khi tạo hóa đơn" } });
    }
};

const getTicketAndProductByOrderId = async (req, res) => {
    try {
        const result = await orderService.getTicketAndProductByOrderId(req.params.orderid);
        return res.json(result);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin hóa đơn:", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const ordersWithDetails = await orderService.getAllOrders();
        return res.status(200).json(ordersWithDetails);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderDetail = await orderService.getOrderById(req.params.id);
        if (!orderDetail) {
            return res.status(404).json({ error: { message: 'Không tìm thấy đơn hàng' } });
        }
        return res.status(200).json(orderDetail);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getOrderByCode = async (req, res) => {
    try {
        const result = await orderService.getOrderByCode(req.params.ordercode);
        if (!result) {
            return res.status(404).json({ error: { message: "Hóa đơn không tồn tại" } });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=hoadon_${result.ordercode}.pdf`);
        res.end(result.pdfBuffer);
    } catch (error) {
        console.error("Lỗi khi tạo hóa đơn:", error);
        return res.status(500).json({ error: { message: "Lỗi khi tạo hóa đơn" } });
    }
};

const getOrderWithInfoById = async (req, res) => {
    try {
        const result = await orderService.getOrderWithInfoById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: { message: 'Hóa đơn không tồn tại' } });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi lấy hóa đơn:", error);
        return res.status(500).json({ error: { message: "Lỗi khi lấy hóa đơn" } });
    }
};

const getOrderByUserId = async (req, res) => {
    try {
        const result = await orderService.getOrderByUserId(req.params.userid);
        if (!result) {
            return res.status(404).json({ error: { message: "Hóa đơn không tồn tại" } });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi lấy hóa đơn theo user_id:", error);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const getOrderWithUserInfo = async (req, res) => {
    try {
        const result = await orderService.getOrderWithUserInfo(req.params.orderid);
        if (!result) {
            return res.status(404).json({ error: { message: "Hóa đơn không tồn tại" } });
        }
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteOrderById = async (req, res) => {
    try {
        const order = await orderService.deleteOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: { message: "Hóa đơn không tồn tại" } });
        }
        return res.status(204).json("Xóa hóa đơn thành công");
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const deleteOrderByUserId = async (req, res) => {
    try {
        const result = await orderService.deleteOrderByUserId(req.params.userid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "Không có hóa đơn nào được tìm thấy để xóa!" } });
        }
        return res.status(200).send(`${result.deletedCount} hóa đơn đã được xóa.`);
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

const updateOrderById = async (req, res) => {
    try {
        const result = await orderService.updateOrderById(req.params.id, req.body);
        if (result?.error) {
            return res.status(result.error === "Hóa đơn không tồn tại" ? 404 : 400).json({ error: { message: result.error } });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi server" } });
    }
};

module.exports = {
    createOrder,
    createOrders,
    getOrderById,
    getAllOrders,
    getTicketAndProductByOrderId,
    getOrderByCode,
    getOrderWithInfoById,
    getOrderByUserId,
    getOrderWithUserInfo,
    deleteOrderById,
    deleteOrderByUserId,
    updateOrderById
};