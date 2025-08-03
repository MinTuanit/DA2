const Payment = require("../models/payment");

async function createPayment(data) {
  return await Payment.create(data);
}

async function getAllPayments() {
  const payments = await Payment.find()
    .populate({ path: 'discount_id', select: 'code' })
    .populate({ path: 'order_id', select: 'code total_price' });

  if (!payments || payments.length === 0) return null;

  return payments.map(payment => ({
    _id: payment._id,
    amount: payment.amount,
    payment_method: payment.payment_method,
    paid_at: payment.paid_at,
    order: payment.order_id ? {
      order_id: payment.order_id._id,
      code: payment.order_id.code,
      total_price: payment.order_id.total_price
    } : null,
    discount: payment.discount_id ? {
      discount_id: payment.discount_id._id,
      code: payment.discount_id.code
    } : null
  }));
}

async function getPaymentById(id) {
  const payment = await Payment.findById(id)
    .populate({ path: 'discount_id', select: 'code' })
    .populate({ path: 'order_id', select: 'code total_price' });

  if (!payment) return null;

  return {
    _id: payment._id,
    amount: payment.amount,
    payment_method: payment.payment_method,
    paid_at: payment.paid_at,
    order: payment.order_id ? {
      order_id: payment.order_id._id,
      code: payment.order_id.code,
      total_price: payment.order_id.total_price
    } : null,
    discount: payment.discount_id ? {
      discount_id: payment.discount_id._id,
      code: payment.discount_id.code
    } : null
  };
}

async function deletePaymentById(id) {
  return await Payment.findByIdAndDelete(id);
}

async function updatePaymentById(id, data) {
  return await Payment.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  deletePaymentById,
  updatePaymentById
};