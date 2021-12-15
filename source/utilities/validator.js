const { check } = require('express-validator');

/** Run validation for Deposit */
exports.checkDeposit = [
    check('description', 'Deposit description is requried').exists(),
    check('amount', 'Deposit ammount is required').exists(),
    check('pin', 'Transaction pin is required').exists(),
    check('pin', 'Transaction pin must be a 4 digit code').isLength({ min: 4 }),
];
/** Run validation for withdrawl */
exports.checkWithdrawal = [
    check('amount', 'Withdrawal ammount is required').exists(),
    check('pin', 'Transaction pin is required').exists(),
    check('pin', 'Transaction pin must be a 4 digit code').isLength({ min: 4 }),
];

/** Run validation for withdrawl */
exports.checkWithdrawal = [
    check('beneficiary', 'beneficiary account number is required').exists(),
    check('description', 'Deposit description is requried').exists(),
    check('amount', 'transfer ammount is required').exists(),
    check('pin', 'Transaction pin is required').exists(),
    check('pin', 'Transaction pin must be a 4 digit code').isLength({ min: 4 }),
];
