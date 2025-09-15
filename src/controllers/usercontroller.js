const userService = require('../services/user.service');

const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    if (result?.error) {
      return res.status(400).json({ error: { message: result.error } });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error: " + error.message } });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error: " + error.message } });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: { message: "User not found!" } });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error: " + error.message } });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: { message: "Missing Email!" } });
    }
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: { message: "Email not found!" } });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error: " + error.message } });
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
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error: " + error.message } });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await userService.deleteUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: { message: "User not found!" } });
    }
    return res.status(200).json({ message: "Dlete user successfully." });
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error: " + error.message } });
  }
};

const updateUserById = async (req, res) => {
  try {
    const result = await userService.updateUserById(req.params.id, req.body);
    if (result?.error) {
      return res.status(result.error.startsWith("User not found!") ? 404 : 400).json({ error: { message: result.error } });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error: " + error.message } });
  }
};

const getUserCreditPoints = async (req, res) => {
  try {
    const result = await userService.getUserCreditPoints(req.params.userid);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: { message: "Server Error: " + error.message } });
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