const Joi = require("joi");

const createOrder = {
  body: Joi.object().keys({
    ordercode: Joi.string().required(),
    total_price: Joi.number().required(),
    status: Joi.string().valid("pending", "completed", "cancelled").optional(),
    ordered_at: Joi.date().optional(),
    user_id: Joi.string().optional().allow(null, ''),
    amount: Joi.number().required(),
    payment_method: Joi.string().valid("momo", "banking", "visa/mastercard", "cash").required(),
    paid_at: Joi.date().optional(),
    discount_id: Joi.string().optional().allow(null, ''),
  }),
};

const updateOrder = {
  body: Joi.object().keys({
    ordercode: Joi.string(),
    total_price: Joi.number(),
    status: Joi.string().valid("pending", "completed", "cancelled"),
    ordered_at: Joi.date(),
    user_id: Joi.string().allow(null, ''),
    amount: Joi.number(),
    payment_method: Joi.string().valid("momo", "banking", "visa/mastercard", "cash"),
    paid_at: Joi.date(),
    discount_id: Joi.string().allow(null, ''),
  }),
};

module.exports = {
  createOrder,
  updateOrder,
};