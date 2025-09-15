const bcrypt = require("bcryptjs");
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const tokenservice = require("./token");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const blacklist = new Set();

async function register(req, res, createUser) {
  return await createUser(req, res);
}

async function login(email, password) {
  const user = await User.findOne({ email: email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  const accessToken = tokenservice.generateAccessToken(user);
  const refreshToken = tokenservice.generateRefreshToken(user);
  return { accessToken, refreshToken, user_id: user._id };
}

function logout(refreshToken) {
  if (!refreshToken) return { error: "Refresh token required!" };
  if (blacklist.has(refreshToken)) return { error: "Token has been disabled." };
  blacklist.add(refreshToken);
  return { message: "Log out successfully." };
}

function refreshtoken(refreshToken) {
  if (!refreshToken) return { error: "Refresh token required!" };
  const newAccessToken = tokenservice.refreshAccessToken(refreshToken);
  if (!newAccessToken) return { error: "Refresh token is invalid or expired!" };
  return { accessToken: newAccessToken };
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) return { error: "User not found!" };
  const token = crypto.randomBytes(32).toString("hex");
  const expireTime = Date.now() + 15 * 60 * 1000;
  user.resetPasswordToken = token;
  user.resetPasswordExpires = expireTime;
  await user.save();
  const resetLink = `http://localhost:5173/user/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Rạp Chiếu Phim" <${process.env.MAIL_USERNAME}>`,
    to: email,
    subject: "Yêu cầu đặt lại mật khẩu",
    html: `<p>Click vào link sau để đặt lại mật khẩu:</p><a href="${resetLink}">${resetLink}</a>`,
  });
  return { message: "Send Email to reset password successfully." };
}

async function resetPassword(token, newPassword) {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return { error: "Refresh token is invalid or expired!" };
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return { message: "Reset password successfully." };
}

module.exports = {
  register,
  login,
  logout,
  refreshtoken,
  forgotPassword,
  resetPassword,
};