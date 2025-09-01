const Joi = require("joi");

const createDiscount = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    discount_type: Joi.string().valid('percentage', 'fixed').required(),
    value: Joi.number().required(),
    max_usage: Joi.number().required(),
    remaining: Joi.number().required(),
    min_purchase: Joi.number().required(),
    expiry_date: Joi.date().required(),
    movie_id: Joi.string().optional().allow(null, ''),
    credit: Joi.number().optional(),
  }),
};

const updateDiscount = {
  body: Joi.object().keys({
    code: Joi.string(),
    discount_type: Joi.string().valid('percentage', 'fixed'),
    value: Joi.number(),
    max_usage: Joi.number(),
    remaining: Joi.number(),
    min_purchase: Joi.number(),
    expiry_date: Joi.date(),
    movie_id: Joi.string().optional().allow(null, ''),
    credit: Joi.number().optional(),
  }),
};

module.exports = {
  createDiscount,
  updateDiscount,
};