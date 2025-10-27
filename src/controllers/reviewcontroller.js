const reviewService = require('../services/review.service');

const createReview = async (req, res) => {
    try {
        const review = await reviewService.createReview(req.body);
        return res.status(201).json(review);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getAllReviews();
        // if (!reviews || reviews.length === 0) {
        //     return res.status(404).json({ error: { message: "No reviews!" } });
        // }
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllUnverifiedReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getAllUnverifiedReviews();
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: { message: "Review not found!" } });
        }
        return res.status(200).json(review);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getReviewByMovieId = async (req, res) => {
    try {
        const { movie_id, user_id } = req.body;
        const reviews = await reviewService.getReviewByMovieId(movie_id, user_id);
        // if (!reviews || reviews.length === 0) {
        //     return res.status(404).json({ error: { message: "No reviews!" } });
        // }
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getReviewWithUserInfo = async (req, res) => {
    try {
        const review = await reviewService.getReviewWithUserInfo(req.params.reviewid);
        // if (!review) {
        //     return res.status(404).json({ error: { message: "Review not found!" } });
        // }
        return res.status(200).json(review);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteReviewById = async (req, res) => {
    try {
        const deleted = await reviewService.deleteReviewById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: { message: "Review not found!" } });
        }
        return res.status(204).send();
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteReviewByMovieId = async (req, res) => {
    try {
        const result = await reviewService.deleteReviewByMovieId(req.params.movieid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: { message: "No reviews to delete!" } });
        }
        return res.status(200).json({ message: `${result.deletedCount} reviews have been deleted.` });
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const updateReviewById = async (req, res) => {
    try {
        const updated = await reviewService.updateReviewById(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: { message: "Review not found!" } });
        }
        return res.status(200).json(updated);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
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
    updateReviewById,
    getAllUnverifiedReviews
};