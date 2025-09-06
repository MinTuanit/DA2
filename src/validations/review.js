const Joi = require('joi');
const { BadWordFilter } = require('@dwcks/bad-word-filter-vi-en');

let filter;

(async () => {
  filter = await BadWordFilter.create();
})();

const commentFilter = (value, helpers) => {
  if (!value) return value;
  if (!filter) throw new Error("The word filter system is not ready, please try again later!");;

  if (filter.hasBadWord(value)) {
    return filter.filter(value);
  }
  return value;
};

const createReview = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    movie_id: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string()
      .optional()
      .allow('')
      .custom(commentFilter, 'Profanity filter'),
    created_at: Joi.date().optional(),
    isVerify: Joi.boolean().optional(),
  }),
};

const updateReview = {
  body: Joi.object().keys({
    user_id: Joi.string(),
    movie_id: Joi.string(),
    rating: Joi.number().min(1).max(5),
    comment: Joi.string()
      .allow('')
      .custom(commentFilter, 'Profanity filter'),
    created_at: Joi.date(),
    isVerify: Joi.boolean(),
  }),
};

module.exports = {
  createReview,
  updateReview,
};
