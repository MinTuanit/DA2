const Joi = require("joi");

const createCinema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
  }),
};

const updateCinema = {
  body: Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
  }),
};

module.exports = {
  createCinema,
  updateCinema,
};
