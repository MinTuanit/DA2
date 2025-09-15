const Constraint = require("../models/constraint");

const createSetting = async (req, res) => {
    try {
        const existing = await Constraint.findOne();
        if (existing) {
            return res.status(400).json({ error: { message: "The setting already exists. Please use API to update." } });
        }

        const constraint = new Constraint(req.body);
        await constraint.save();

        return res.status(201).json(constraint);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getSetting = async (req, res) => {
    try {
        const constraint = await Constraint.findOne();
        if (!constraint) {
            return res.status(404).json({ error: { message: "System settings not found!." } });
        }

        return res.status(200).json(constraint);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const updateSetting = async (req, res) => {
    try {
        const constraint = await Constraint.findOne();
        if (!constraint) {
            return res.status(404).json({ error: { message: "There are no settings to update!" } });
        }

        Object.assign(constraint, req.body);
        await constraint.save();

        return res.status(200).json(constraint);
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

module.exports = {
    createSetting,
    getSetting,
    updateSetting
};