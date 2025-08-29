const Order = require("../models/order");

const generateUniqueOrderCode = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isDuplicate = true;

  while (isDuplicate) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existing = await Order.findOne({ ordercode: code });
    if (!existing) {
      isDuplicate = false;
    }
  }
  return code;
};

module.exports = generateUniqueOrderCode;