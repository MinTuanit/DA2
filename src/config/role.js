const allRoles = {
    customer: [
        "getUserByEmail",
        "getCinema",
        "getDiscount",
        "getEmployee",
        "getMovie",
        "getProduct",
        "getRoom",
        "getSeat",
        "getShowTime",
        "getUser",
        "getReview",
    ],
    employee: [
        "getUserByEmail",
        "getCinema",
        "getDiscount",
        "getEmployee",
        "getMovie",
        "getProduct",
        "getRoom",
        "getSeat",
        "getShowTime",
        "getUser",
        "getOrderBycode",
        "getReview",
    ],
    admin: [
        "getUserByEmail",
        "getCinema",
        "getDiscount",
        "getEmployee",
        "getMovie",
        "getProduct",
        "getRoom",
        "getSeat",
        "getShowTime",
        "getUser",
        "getReview",
        "getOrderBycode",
        "manageCinema",
        "manageDiscount",
        "manageEmployee",
        "manageMovie",
        "manageProduct",
        "manageRoom",
        "manageSeat",
        "manageShowTime",
        "manageUser",
        "managerReview"
    ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

const getPermissionByRole = (roleName) => {
    return roleRights.get(roleName);
};

module.exports = {
    roles,
    roleRights,
    getPermissionByRole,
};
