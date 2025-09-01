const Joi = require("joi");

const createTicket = {
  body: Joi.object().keys({
    order_id: Joi.string().required(),
    showtime_id: Joi.string().required(),
    seat_id: Joi.string().required(),
  }),
};

const updateTicket = {
  body: Joi.object().keys({
    order_id: Joi.string(),
    showtime_id: Joi.string(),
    seat_id: Joi.string(),
  }),
};

module.exports = {
  createTicket,
  updateTicket,
};