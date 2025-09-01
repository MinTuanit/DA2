const Joi = require("joi");

const createOrderProductDetail = {
  body: Joi.object().keys({
    order_id: Joi.string().required(),
    product_id: Joi.string().required(),
    quantity: Joi.number().required(),
  }),
};

const updateOrderProductDetail = {
  body: Joi.object().keys({
    order_id: Joi.string(),
    product_id: Joi.string(),
    quantity: Joi.number(),
  }),
};

module.exports = {
  createOrderProductDetail,
  updateOrderProductDetail,
};