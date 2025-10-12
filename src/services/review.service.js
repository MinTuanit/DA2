const Review = require("../models/review");
const Movie = require("../models/movie");

async function createReview(data) {
  const review = await Review.create(data);
  const movieId = review.movie_id;
  const reviews = await Review.find({ movie_id: movieId });
  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / (reviews.length || 1);
  await Movie.findByIdAndUpdate(movieId, { rating: avgRating });
  return review;
}

async function getAllReviews() {
  const reviews = await Review.find()
    .populate({ path: 'user_id', select: 'full_name email' })
    .populate({ path: 'movie_id', select: 'title' });
  if (!reviews || reviews.length === 0) return [];
  return reviews.map(review => ({
    _id: review._id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    user: review.user_id ? {
      user_id: review.user_id._id,
      full_name: review.user_id.full_name,
      email: review.user_id.email
    } : null,
    movie: review.movie_id ? {
      movie_id: review.movie_id._id,
      title: review.movie_id.title
    } : null
  }));
}

async function getAllUnverifiedReviews() {
  const reviews = await Review.find({ isVerify: false })
    .populate({ path: 'user_id', select: 'full_name email' })
    .populate({ path: 'movie_id', select: 'title' });

  if (!reviews || reviews.length === 0) return [];

  return reviews.map(review => ({
    _id: review._id,
    movie: review.movie_id ? {
      movie_id: review.movie_id._id,
      title: review.movie_id.title
    } : null,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    user: review.user_id ? {
      user_id: review.user_id._id,
      full_name: review.user_id.full_name,
      email: review.user_id.email
    } : null
  }));
}

async function getReviewById(id) {
  return await Review.findById(id);
}

async function getReviewByMovieId(movieid, currentUserId) {
  const reviews = await Review.find({
    movie_id: movieid,
    $or: [
      { isVerify: true },
      { $and: [{ isVerify: false }, { user_id: currentUserId }] }
    ]
  }).populate({ path: 'user_id', select: 'full_name email' });

  if (!reviews || reviews.length === 0) return [];

  return reviews.map(review => ({
    _id: review._id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    user: review.user_id ? {
      user_id: review.user_id._id,
      full_name: review.user_id.full_name,
      email: review.user_id.email
    } : null
  }));
}

async function getReviewWithUserInfo(reviewid) {
  const review = await Review.findById(reviewid)
    .populate({ path: 'user_id', select: 'full_name email' });
  if (!review) return null;
  return {
    _id: review._id,
    movie_id: review.movie_id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    user: review.user_id ? {
      user_id: review.user_id._id,
      full_name: review.user_id.full_name,
      email: review.user_id.email,
    } : null
  };
}

async function deleteReviewById(id) {
  return await Review.findByIdAndDelete(id);
}

async function deleteReviewByMovieId(movieid) {
  return await Review.deleteMany({ movie_id: movieid });
}

async function updateReviewById(id, data) {
  return await Review.findByIdAndUpdate(id, data, { new: true });
}

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