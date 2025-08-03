const authservice = require("../services/auth.service");
const usercontroller = require("./usercontroller");

const register = async (req, res) => {
    try {
        await authservice.register(req, res, usercontroller.createUser);
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: { message: "Email và mật khẩu là bắt buộc!" } });
        }
        const result = await authservice.login(email, password);
        if (!result) {
            return res.status(401).json({ error: { message: "Email hoặc mật khẩu không đúng!" } });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
    }
};

const logout = (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = authservice.logout(refreshToken);
        if (result.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        return res.status(200).json({ message: result.message });
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
    }
};

const refreshtoken = (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = authservice.refreshtoken(refreshToken);
        if (result.error) {
            return res.status(403).json({ error: { message: result.error } });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authservice.forgotPassword(email);
        if (result.error) {
            return res.status(404).json({ error: { message: result.error } });
        }
        return res.status(200).json({ message: result.message });
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authservice.resetPassword(token, newPassword);
        if (result.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        return res.status(200).json({ message: result.message });
    } catch (error) {
        return res.status(500).json({ error: { message: "Lỗi Server: " + error.message } });
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshtoken,
    forgotPassword,
    resetPassword,
};