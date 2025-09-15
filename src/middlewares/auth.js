const passport = require("passport");
const { getPermissionByRole } = require("../config/role");
const ApiError = require("../utils/ApiError");

const verifyCallBack =
    (req, resolve, reject, requiredRights) => async (err, user, info) => {
        if (err || info || !user) {
            return reject(new ApiError(401, "Please authenticate"));
        }
        req.user = user;

        if (requiredRights.length) {
            try {
                const userPermissions = await getPermissionByRole(user.role);

                const hasRequiredRights = requiredRights.every((requiredRight) =>
                    userPermissions.includes(requiredRight)
                );

                if (!hasRequiredRights) {
                    throw new ApiError(403, "Forbidden");
                }

                if (requiredRights.includes("getUserByEmail")) {
                    const requestedEmail = req.query.email;

                    if (user.role !== "admin" && requestedEmail && requestedEmail !== user.email) {
                        throw new ApiError(403, "You do not have permission to view other people's information!");
                    }
                }
            } catch (err) {
                return reject(err instanceof ApiError ? err : new ApiError(500, "Error fetching role permissions"));
            }
        }
        resolve();
    };

const auth =
    (...requiredRights) =>
        async (req, res, next) => {
            return new Promise((resolve, reject) => {
                passport.authenticate(
                    "jwt",
                    { session: false },
                    verifyCallBack(req, resolve, reject, requiredRights)
                )(req, res, next);
            })
                .then(() => next())
                .catch((err) => next(err));
        };

module.exports = auth;