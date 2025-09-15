const employeeservice = require("../services/employee.service");

const createEmployee = async (req, res) => {
    try {
        const result = await employeeservice.createEmployee(req.body);
        if (result.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeservice.getAllEmployees();
        return res.status(200).json(employees);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeservice.getEmployeeById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: { message: "Employee not found!" } });
        }
        return res.status(200).json(employee);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getEmployeesByCinemaId = async (req, res) => {
    try {
        const employees = await employeeservice.getEmployeesByCinemaId(req.params.cinemaid);
        return res.status(200).json(employees);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteEmployeeById = async (req, res) => {
    try {
        const result = await employeeservice.deleteEmployeeById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: { message: "Employee not found!" } });
        }
        return res.status(200).json({ message: "Delete employee successfully." });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const updateEmployeeById = async (req, res) => {
    try {
        const result = await employeeservice.updateEmployeeById(req.params.id, req.body);
        if (!result) {
            return res.status(404).json({ error: { message: "Employee not found!" } });
        }
        if (result.error) {
            return res.status(400).json({ error: { message: result.error } });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById,
    getEmployeesByCinemaId
};