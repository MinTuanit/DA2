const orderProductDetailService = require('../services/orderproductdetail.service');

const createOrderProduct = async (req, res) => {
    try {
        const newOrderProduct = await orderProductDetailService.createOrderProduct(req.body);
        return res.status(201).json(newOrderProduct);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllOrderProducts = async (req, res) => {
    try {
        const orderProducts = await orderProductDetailService.getAllOrderProducts();
        return res.status(200).json(orderProducts);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getOrderProductById = async (req, res) => {
    try {
        const orderProduct = await orderProductDetailService.getOrderProductById(req.params.id);
        if (!orderProduct) {
            return res.status(404).json({ error: { message: "OrderDetail not found!" } });
        }
        return res.status(200).json(orderProduct);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getOrderProductsByOrderId = async (req, res) => {
    try {
        const orderProducts = await orderProductDetailService.getOrderProductsByOrderId(req.params.orderid);
        if (!orderProducts || orderProducts.length === 0) {
            return res.status(404).json({ error: { message: "There is no orderdetail for this order!" } });
        }
        return res.status(200).json(orderProducts);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteOrderProductById = async (req, res) => {
    try {
        const deleted = await orderProductDetailService.deleteOrderProductById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: { message: "OrderDetail not found!" } });
        }
        return res.status(204).send();
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const updateOrderProductById = async (req, res) => {
    try {
        const updated = await orderProductDetailService.updateOrderProductById(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: { message: "OrderDetail not found!" } });
        }
        return res.status(200).json(updated);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

module.exports = {
    createOrderProduct,
    getAllOrderProducts,
    getOrderProductById,
    getOrderProductsByOrderId,
    deleteOrderProductById,
    updateOrderProductById
};