const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");

async function createUser(data) {
  const { email, phone, cccd, password } = data;
  if (await User.isEmailTaken(email)) {
    return { error: "Email đã tồn tại, vui lòng chọn email khác!" };
  }
  if (await User.isPhoneTaken(phone)) {
    return { error: "Số điện thoại đã tồn tại" };
  }
  if (await User.isCccdTaken(cccd)) {
    return { error: "CCCD đã tồn tại" };
  }
  if (!password.match(/\d/) || !password.match(/[a-zA-Z]/) || password.length < 8) {
    return { error: "Mật khẩu phải chứa ít nhất 8 ký tự và chứa 1 số và 1 chữ cái." };
  }
  data.password = await bcrypt.hash(password, 8);
  const user = await User.create(data);
  return { user };
}

async function getAllUsers() {
  return await User.find();
}

async function getUserById(id) {
  return await User.findById(id);
}

async function getUserByEmail(email) {
  return await User.findOne({ email });
}

async function getUserByRole(role) {
  const validRoles = ["customer", "employee"];
  if (!validRoles.includes(role)) {
    return { error: "Vai trò không hợp lệ: " + role };
  }
  const users = await User.find({ role });
  if (users.length === 0) {
    return { error: "No user found with role: " + role };
  }
  const usersWithCredit = await Promise.all(users.map(async user => {
    const orders = await Order.find({
      user_id: user._id,
      status: 'completed'
    });
    const totalSpent = orders.reduce((sum, order) => sum + order.total_price, 0);
    return {
      ...user.toObject(),
      credit: totalSpent
    };
  }));
  return usersWithCredit;
}

async function deleteUserById(id) {
  return await User.findByIdAndDelete(id);
}

async function updateUserById(id, data) {
  const { email, phone, cccd, password } = data;

  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== id) {
      return { error: "Email already exists, please choose another email!" };
    }
  }
  if (phone) {
    const existingPhone = await User.findOne({ phone });
    if (existingPhone && existingPhone._id.toString() !== id) {
      return { error: "Phone number already exists!" };
    }
  }
  if (cccd) {
    const existingCccd = await User.findOne({ cccd });
    if (existingCccd && existingCccd._id.toString() !== id) {
      return { error: "CCCD already exists!" };
    }
  }
  if (password) {
    if (password.length < 8 || !password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
      return { error: "Password must be at least 8 characters and contain 1 number and 1 letter!" };
    }
    data.password = await bcrypt.hash(password, 8);
  }
  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
  if (!updatedUser) {
    return { error: "User not found!" };
  }
  return { user: updatedUser };
}

async function getUserCreditPoints(userid) {
  const orders = await Order.find({
    user_id: userid,
    status: 'completed'
  });
  const totalSpent = orders.reduce((sum, order) => sum + order.total_price, 0);
  return { credit_points: totalSpent };
}

module.exports = {
  createUser,
  updateUserById,
  getAllUsers,
  deleteUserById,
  getUserById,
  getUserByEmail,
  getUserByRole,
  getUserCreditPoints
};