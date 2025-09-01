const Joi = require("joi");

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().optional().allow(''),
    image_url: Joi.string().optional().allow(''),
    category: Joi.string().optional().allow(''),
    stock: Joi.number().optional(),
  }),
};

const updateProduct = {
  body: Joi.object().keys({
    name: Joi.string(),
    price: Joi.number(),
    description: Joi.string().allow(''),
    image_url: Joi.string().allow(''),
    category: Joi.string().allow(''),
    stock: Joi.number(),
  }),
};

module.exports = {
  createProduct,
  updateProduct,
};