const router = require('express').Router();
const validator = require('../utilities/validator');
const { ROLES } = require('../configuration');
const userCtrl = require('../controllers/user.controller');
const transactionCtrl = require('../controllers/transaction.controller');
const { auth, protect } = require('../middlewares/auth.middleware');

router.use('/update', auth);
router.post('/update/pin', userCtrl.createPin);

// Transactions routers
router.use('/transactions', auth, protect(ROLES));
router
    .get('/transactions', transactionCtrl.getAllTransactions)
    .post('/transactions/deposit', validator.checkDeposit, transactionCtrl.createDepositTransaction)
    .post('/transactions/withdrawal', validator.checkWithdrawal, transactionCtrl.createWithdrawalTransaction)
    .post('/transactions/transfer', validator.checkTransfer, transactionCtrl.createTransferTransaction)
    .post('/transactions/report', validator.checkcomplain, transactionCtrl.reportTransaction);

// Admin users routes
router.use('/', auth, protect([ROLES[1]]));
router.route('/').post(userCtrl.CreateUser);
router.route('/:userId').patch(userCtrl.disableUser);
router.route('/:userId').delete(userCtrl.deleteUser);
module.exports = router;
