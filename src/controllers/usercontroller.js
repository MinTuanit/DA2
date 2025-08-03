const userService = require('../services/user.service');

const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    if (result?.error) {
      return res.status(400).json({ error: { message: result.error } });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error("Lỗi server!", error);
    return res.status(500).json({ error: { message: "Đã xảy ra lỗi khi tạo người dùng: " + error.message } });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi server!", error);
    return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: { message: "Không tìm thấy tài khoản có id: " + req.params.id } });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi server!", error);
    return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: { message: "Thiếu email!" } });
    }
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: { message: "Email không tồn tại!" } });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi server!", error);
    return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
  }
};

const getUserByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const result = await userService.getUserByRole(role);
    if (result?.error) {
      return res.status(400).json({ error: { message: result.error } });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi server!", error);
    return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await userService.deleteUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: { message: "Không tìm thấy tài khoản có id: " + req.params.id } });
    }
    return res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    console.error("Lỗi server!", error);
    return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
  }
};

const updateUserById = async (req, res) => {
  try {
    const result = await userService.updateUserById(req.params.id, req.body);
    if (result?.error) {
      return res.status(result.error.startsWith("Không tìm thấy") ? 404 : 400).json({ error: { message: result.error } });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi server!", error);
    return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
  }
};

const getUserCreditPoints = async (req, res) => {
  try {
    const result = await userService.getUserCreditPoints(req.params.userid);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: { message: "Lỗi khi tính điểm tích lũy" } });
  }
};

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