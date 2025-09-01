const Joi = require("joi");

const createRoom = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    seat_count: Joi.number().required(),
    cinema_id: Joi.string().required(),
  }),
};

const updateRoom = {
  body: Joi.object().keys({
    name: Joi.string(),
    seat_count: Joi.number(),
    cinema_id: Joi.string(),
  }),
};

module.exports = {
  createRoom,
  updateRoom,
};