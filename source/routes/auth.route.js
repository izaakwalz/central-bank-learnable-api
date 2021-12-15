const router = require('express').Router();
const authCtrl = require('../controllers/auth.controller');

router.route('/login').post(authCtrl.login);
router.route('/request-password-reset').post(authCtrl.requestPasswordReset);
router.route('/reset-password/:code/sign').post(authCtrl.passwordReset);

module.exports = router;
