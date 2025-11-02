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

const getAvailableDiscounts = async (req, res) => {
    try {
        const { amount, rank, movie_id } = req.body;

        if (amount == null) {
            return res.status(400).json({ error: { message: "Missing amount in request body" } });
        }

        // Thứ tự rank
        const rankOrder = {
            null: 0,
            Bronze: 1,
            Silver: 2,
            Gold: 3
        };

        const userRankKey = (rank == null || rank === "") ? "null" : String(rank);
        const userRankValue = rankOrder[userRankKey] || 0;

        // Lấy toàn bộ discount
        const discounts = await discountservice.getAllDiscounts();

        const result = discounts.map(d => {
            const obj = (typeof d.toObject === "function") ? d.toObject() : { ...d };

            // Lấy rank yêu cầu (nếu có)
            const requiredRank = d.rank || null;
            const requiredRankKey = (requiredRank == null || requiredRank === "") ? "null" : String(requiredRank);
            const requiredRankValue = rankOrder[requiredRankKey] || 0;

            // Các điều kiện
            const meetsAmount = typeof d.min_purchase === "number" ? amount >= d.min_purchase : true;
            const meetsRank = userRankValue >= requiredRankValue;

            // Nếu discount có movie_id, chỉ hợp lệ khi trùng
            const meetsMovie = d.movie_id ? String(d.movie_id) === String(movie_id) : true;

            // Còn hạn và còn số lượng (tùy chọn)
            const meetsRemaining = typeof d.remaining === "number" ? d.remaining > 0 : true;
            const meetsExpiry = d.expiry_date ? new Date(d.expiry_date) >= new Date() : true;

            // Tổng hợp điều kiện
            const isAvailable = meetsAmount && meetsRank && meetsMovie && meetsRemaining && meetsExpiry;

            return {
                ...obj,
                isAvailable
            };
        });

        return res.status(200).json(result);
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
    getDiscountByCode,
    getAvailableDiscounts
};