const Employee = require("../models/employee");
const User = require("../models/user");
const Setting = require("../models/constraint");

async function createEmployee(data) {
  const {
    full_name, email, phone, password, cccd,
    dateOfBirth, position, shift, cinema_id
  } = data;

  if (await User.isEmailTaken(email)) {
    return { error: "Email đã tồn tại, vui lòng chọn email khác!" };
  }
  if (await User.isPhoneTaken(phone)) {
    return { error: "Số điện thoại đã tồn tại" };
  }
  if (await User.isCccdTaken(cccd)) {
    return { error: "CCCD đã tồn tại" };
  }
  if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
    return { error: "Mật khẩu phải chứa ít nhất 1 số và 1 chữ cái." };
  }

  const setting = await Setting.findOne();
  if (!setting) {
    return { error: "Không tìm thấy cài đặt hệ thống." };
  }
  const { employee_min_age, employee_max_age } = setting;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  if (age < employee_min_age || age > employee_max_age) {
    return { error: `Tuổi nhân viên phải nằm trong khoảng từ ${employee_min_age} đến ${employee_max_age}.` };
  }

  const employee = await Employee.create({
    full_name, email, phone, password, cccd,
    dateOfBirth, role: "employee", position, shift, cinema_id
  });

  return { employee };
}

async function getAllEmployees() {
  const employeesRaw = await Employee.find().populate({ path: "cinema_id", select: "name" });
  return employeesRaw.map(emp => {
    const { cinema_id, ...rest } = emp.toObject();
    return {
      ...rest,
      cinema: {
        cinema_id: cinema_id?._id,
        name: cinema_id?.name
      }
    };
  });
}

async function getEmployeeById(id) {
  const employeeRaw = await Employee.findById(id)
    .populate({ path: "cinema_id", select: "name" });
  if (!employeeRaw) return null;
  const { cinema_id, ...rest } = employeeRaw.toObject();
  return {
    ...rest,
    cinema: {
      cinema_id: cinema_id?._id,
      name: cinema_id?.name
    }
  };
}

async function getEmployeesByCinemaId(cinemaId) {
  const employeesRaw = await Employee.find({ cinema_id: cinemaId })
    .populate({ path: "cinema_id", select: "name" });
  return employeesRaw.map(emp => {
    const { cinema_id, ...rest } = emp.toObject();
    return {
      ...rest,
      cinema: {
        cinema_id: cinema_id?._id,
        name: cinema_id?.name
      }
    };
  });
}

async function deleteEmployeeById(id) {
  const employee = await Employee.findById(id);
  if (!employee) return null;
  await Employee.findByIdAndDelete(id);
  return true;
}

async function updateEmployeeById(id, data) {
  const {
    full_name, email, phone, password, cccd,
    dateOfBirth, position, shift, cinema_id
  } = data;

  const setting = await Setting.findOne();
  if (!setting) {
    return { error: "Không tìm thấy cài đặt hệ thống." };
  }
  const { employee_min_age, employee_max_age } = setting;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  if (age < employee_min_age || age > employee_max_age) {
    return { error: `Tuổi nhân viên phải nằm trong khoảng từ ${employee_min_age} đến ${employee_max_age}.` };
  }

  const employee = await Employee.findById(id);
  if (!employee) return null;

  if (full_name !== undefined) employee.full_name = full_name;
  if (email !== undefined) employee.email = email;
  if (phone !== undefined) employee.phone = phone;
  if (password !== undefined) employee.password = password;
  if (cccd !== undefined) employee.cccd = cccd;
  if (dateOfBirth !== undefined) employee.dateOfBirth = dateOfBirth;
  if (position !== undefined) employee.position = position;
  if (shift !== undefined) employee.shift = shift;
  if (cinema_id !== undefined) employee.cinema_id = cinema_id;

  await employee.save();
  return employee;
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployeeById,
  getEmployeesByCinemaId
};