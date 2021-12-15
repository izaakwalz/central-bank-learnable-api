const asyncHandler = require('../middlewares/async-handler');
const accountService = require('../services/account.service');
const authService = require('../services/auth.service');
const response = require('../utilities/response');

const login = asyncHandler(async (req, res, next) => {
    const user = await authService.login(req.body);
    if (user.link) return res.status(200).send(response(user.message, { link: user.link }));

    res.status(200).send(response('Login Successfull', user));
});

const requestPasswordReset = asyncHandler(async (req, res, next) => {
    const data = await authService.requestPasswordReset(req.body);
    res.status(200).send(response('Please use this link to reset your password', { link: data }));
});

const passwordReset = asyncHandler(async (req, res, next) => {
    const data = await authService.passwordReset(req.params.code, req.query, req.body.password);
    res.status(200).send(response('Password updated successful', data));
});

module.exports = { login, requestPasswordReset, passwordReset };
