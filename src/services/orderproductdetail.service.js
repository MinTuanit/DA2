const OrderProductDetail = require("../models/orderproductdetail");

async function createOrderProduct(data) {
  return await OrderProductDetail.create(data);
}

async function getAllOrderProducts() {
  return await OrderProductDetail.find();
}

async function getOrderProductById(id) {
  return await OrderProductDetail.findById(id);
}

async function getOrderProductsByOrderId(orderid) {
  return await OrderProductDetail.find({ order_id: orderid });
}

async function deleteOrderProductById(id) {
  return await OrderProductDetail.findByIdAndDelete(id);
}

async function updateOrderProductById(id, data) {
  return await OrderProductDetail.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  createOrderProduct,
  getAllOrderProducts,
  getOrderProductById,
  getOrderProductsByOrderId,
  deleteOrderProductById,
  updateOrderProductById
};