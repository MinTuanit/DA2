const Joi = require("joi");

const createShowtime = {
  body: Joi.object().keys({
    showtime: Joi.date().required(),
    price: Joi.number().required(),
    movie_id: Joi.string().required(),
    room_id: Joi.string().required(),
  }),
};

const updateShowtime = {
  body: Joi.object().keys({
    showtime: Joi.date(),
    price: Joi.number(),
    movie_id: Joi.string(),
    room_id: Joi.string(),
  }),
};

module.exports = {
  createShowtime,
  updateShowtime,
};