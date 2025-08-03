const Discount = require("../models/discount");

async function createDiscount(data) {
  return await Discount.create(data);
}

async function getAllDiscounts() {
  return await Discount.find();
}

async function getDiscountById(id) {
  return await Discount.findById(id);
}

async function getDiscountByCode(code) {
  return await Discount.findOne({ code });
}

async function deleteDiscountById(id) {
  return await Discount.findByIdAndDelete(id);
}

async function updateDiscountById(id, data) {
  return await Discount.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  getDiscountByCode,
  deleteDiscountById,
  updateDiscountById
};