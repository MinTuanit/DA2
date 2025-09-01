const Joi = require("joi");

const createReview = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    movie_id: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional().allow(''),
    created_at: Joi.date().optional(),
  }),
};

const updateReview = {
  body: Joi.object().keys({
    user_id: Joi.string(),
    movie_id: Joi.string(),
    rating: Joi.number().min(1).max(5),
    comment: Joi.string().allow(''),
    created_at: Joi.date(),
  }),
};

module.exports = {
  createReview,
  updateReview,
};