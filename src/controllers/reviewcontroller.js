const reviewService = require('../services/review.service');

const createReview = async (req, res) => {
    try {
        const review = await reviewService.createReview(req.body);
        return res.status(201).json(review);
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getAllReviews();
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ error: { message: "Không có đánh giá nào" } });
        }
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: { message: "Đánh giá không tồn tại" } });
        }
        return res.status(200).json(review);
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getReviewByMovieId = async (req, res) => {
    try {
        const reviews = await reviewService.getReviewByMovieId(req.params.movieid);
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ error: { message: "Không có đánh giá cho phim này" } });
        }
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getReviewWithUserInfo = async (req, res) => {
    try {
        const review = await reviewService.getReviewWithUserInfo(req.params.reviewid);
        if (!review) {
            return res.status(404).json({ error: { message: "Đánh giá không tồn tại" } });
        }
        return res.status(200).json(review);
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const deleteReviewById = async (req, res) => {
    try {
        const deleted = await reviewService.deleteReviewById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: { message: "Đánh giá không tồn tại" } });
        }
        return res.status(204).send();
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const deleteReviewByMovieId = async (req, res) => {
    try {
        const result = await reviewService.deleteReviewByMovieId(req.params.movieid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "Không có đánh giá nào để xóa" } });
        }
        return res.status(200).json({ message: `${result.deletedCount} đánh giá đã được xóa` });
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const updateReviewById = async (req, res) => {
    try {
        const updated = await reviewService.updateReviewById(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: { message: "Đánh giá không tồn tại" } });
        }
        return res.status(200).json(updated);
    } catch (error) {
        console.error("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    getReviewByMovieId,
    getReviewWithUserInfo,
    deleteReviewById,
    deleteReviewByMovieId,
    updateReviewById
};