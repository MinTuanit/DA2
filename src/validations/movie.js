const Joi = require("joi");

const createMovie = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    genre: Joi.array().items(Joi.string()).required(),
    description: Joi.string().optional().allow(''),
    director: Joi.string().optional().allow(''),
    actors: Joi.array().items(Joi.string()).optional(),
    country: Joi.string().required(),
    duration: Joi.number().required(),
    release_date: Joi.date().required(),
    poster_url: Joi.string().required(),
    age_limit: Joi.number().optional(),
    trailer_url: Joi.string().required(),
    rating: Joi.number().min(1).max(5).optional(),
    status: Joi.string().valid('Stopped', 'Unknown', 'Now Playing', 'Coming Soon').optional(),
  }),
};

const updateMovie = {
  body: Joi.object().keys({
    title: Joi.string(),
    genre: Joi.array().items(Joi.string()),
    description: Joi.string().allow(''),
    director: Joi.string().allow(''),
    actors: Joi.array().items(Joi.string()),
    country: Joi.string(),
    duration: Joi.number(),
    release_date: Joi.date(),
    poster_url: Joi.string(),
    age_limit: Joi.number(),
    trailer_url: Joi.string(),
    rating: Joi.number().min(1).max(5),
    status: Joi.string().valid('Stopped', 'Unknown', 'Now Playing', 'Coming Soon'),
  }),
};

module.exports = {
  createMovie,
  updateMovie,
};