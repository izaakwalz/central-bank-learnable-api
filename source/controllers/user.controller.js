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

/**
 * @ {desc}  Create user pin
 * @ {route}  POST /api/v1/users/update/pin
 * @ {access} Private
 */
const createPin = asyncHandler(async (req, res, next) => {
    const data = await userService.createPin({ userId: req.user._id, pin: req.body.pin });
    res.status(200).send(response('Transaction pin created successfully', data));
});

/**
 * @ {desc}  Disable a user
 * @ {route}  PATCH /api/v1/admin/users/disable
 * @ {access} Private
 */
const disableUser = asyncHandler(async (req, res) => {
    const data = await userService.disable(req.params.userId);
    res.status(200).send(response('User disabled successfully', data));
});

/**
 * @ {desc}  Delete a user
 * @ {route} PATCH /api/v1/admin/users/delete
 * @ {access} Private
 */
const deleteUser = asyncHandler(async (req, res) => {
    const data = await userService.delete(req.params.userId);
    res.status(200).send(response('User Deleted successfully', data));
});

module.exports = { CreateUser, createPin, disableUser, deleteUser };
