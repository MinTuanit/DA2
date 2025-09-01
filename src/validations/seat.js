const Joi = require("joi");

const createSeat = {
  body: Joi.object().keys({
    seat_name: Joi.string().required(),
    seat_column: Joi.number().required(),
    room_id: Joi.string().required(),
  }),
};

const updateSeat = {
  body: Joi.object().keys({
    seat_name: Joi.string(),
    seat_column: Joi.number(),
    room_id: Joi.string(),
  }),
};

module.exports = {
  createSeat,
  updateSeat,
};