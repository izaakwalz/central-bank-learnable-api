const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const ErrorResponse = require('../utilities/error-response');
const asyncHandler = require('./async-handler');
const { JWT_SECRET } = require('../configuration');

module.exports = {
    /**General auth middleware */
    auth: asyncHandler(async (req, res, next) => {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
            throw new ErrorResponse('Unauthorized access: please login to proceed', 401);

        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await userService.findOne({ _id: decoded.id }, '+role');

        if (!user) throw new ErrorResponse('Unauthorized access: User does not exist', 401);

        req.user = user;

        next();
    }),
    /** Protect senstive route */
    protect: (roles = []) => {
        return (req, res, next) => {
            if (!req.user.isActive === true)
                throw new ErrorResponse('Unauthorized access: User has been deactivated', 401);

            if (!roles.includes(req.user.role))
                throw new ErrorResponse('Access Denied: sorry, you are not authorized access', 403);

            next();
        };
    },
};
