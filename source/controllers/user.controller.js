const asyncHandler = require('../middlewares/async-handler');
const response = require('../utilities/response');

const userService = require('../services/user.service');

/**
 * @ {desc}  Create a user
 * @ {route}  POST /api/v1/users
 * @ {access} Private
 */
const CreateUser = asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);
    res.status(200).send(response('Success: user created', user));
});

const createPin = asyncHandler(async (req, res, next) => {
    const data = await userService.createPin({ userId: req.user._id, pin: req.body.pin });
    res.status(200).send(response('Transaction pin created successfully', data));
});

module.exports = { CreateUser, createPin };
