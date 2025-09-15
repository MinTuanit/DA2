const discountservice = require("../services/discount.service");

const createDiscount = async (req, res) => {
    try {
        const discount = await discountservice.createDiscount(req.body);
        return res.status(201).json(discount);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await discountservice.getAllDiscounts();
        return res.status(200).json(discounts);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getDiscountById = async (req, res) => {
    try {
        const discount = await discountservice.getDiscountById(req.params.id);
        if (!discount) {
            return res.status(404).json({ error: { message: "Discount not found!" } });
        }
        return res.status(200).json(discount);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getDiscountByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const discount = await discountservice.getDiscountByCode(code);

        if (!discount) {
            return res.status(404).json({ error: { message: "Discount not found!" } });
        }

        return res.status(200).json(discount);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteDiscountById = async (req, res) => {
    try {
        const discount = await discountservice.deleteDiscountById(req.params.id);
        if (!discount) {
            return res.status(404).json({ error: { message: "Discount not found!" } });
        }
        return res.status(200).json({ message: "Delete discount successfully." });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const updateDiscountById = async (req, res) => {
    try {
        const discount = await discountservice.updateDiscountById(req.params.id, req.body);
        if (!discount) {
            return res.status(404).json({ error: { message: "Discount not found!" } });
        }
        return res.status(200).json(discount);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error" } });
    }
};

module.exports = {
    createDiscount,
    updateDiscountById,
    getAllDiscounts,
    deleteDiscountById,
    getDiscountById,
    getDiscountByCode
};