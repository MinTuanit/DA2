const Product = require("../models/product");
const Setting = require("../models/constraint");

async function createProduct(data) {
  const setting = await Setting.findOne();
  if (!setting) {
    return { error: "System settings not found!" };
  }
  const { min_product_price, max_product_price } = setting;
  const price = data.price;
  if (price < min_product_price || price > max_product_price) {
    return { error: `Product price must be between ${min_product_price} and ${max_product_price} VND` };
  }
  const product = await Product.create(data);
  return product;
}

async function getAllProducts() {
  return await Product.find();
}

async function getProductById(id) {
  return await Product.findById(id);
}

async function deleteProductById(id) {
  return await Product.findByIdAndDelete(id);
}

async function updateProductById(id, data) {
  const setting = await Setting.findOne();
  if (!setting) {
    return { error: "System settings not found!" };
  }
  const { min_product_price, max_product_price } = setting;
  const price = data.price;
  if (price < min_product_price || price > max_product_price) {
    return { error: `Product price must be between ${min_product_price} and ${max_product_price} VND` };
  }
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) {
    return { error: "Product not found!" };
  }
  return product;
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  updateProductById
};