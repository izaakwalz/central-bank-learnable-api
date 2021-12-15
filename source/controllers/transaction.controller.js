const { validationResult } = require('express-validator');
const asyncHandler = require('../middlewares/async-handler');
const transactionService = require('../services/transaction.service');
const userService = require('../services/user.service');
const response = require('../utilities/response');

/**
 * @ {desc} Deposit transaction
 */
const createDepositTransaction = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const error_msg = errors.array().map((error) => error.msg);
    // converts multiple error msg to a single string
    if (!errors.isEmpty()) return res.status(400).send(response(error_msg.join(', ')));

    const accNo = await user.acc_no(); // get user account number
    const { message, transaction } = await transactionService.depost(accNo, req.body);
    res.status(200).send(response(message, transaction));
});
/**
 * @ {desc} Withdrwal Transaction
 */
const createWithdrawalTransaction = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const error_msg = errors.array().map((error) => error.msg);

    // converts multiple error msg to a single string
    if (!errors.isEmpty()) return res.status(400).send(response(error_msg.join(', ')));

    const accNo = await req.user.acc_no();
    const { message, transaction } = await transactionService.withdrawal(accNo, req.body);
    res.status(200).send(response(message, transaction));
});

/**
 * @ {desc} Transfer Funds
 * */
const createTransferTransaction = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const error_msg = errors.array().map((error) => error.msg);

    // converts multiple error msg to a single string
    if (!errors.isEmpty()) return res.status(400).send(response(error_msg.join(', ')));

    const accNo = await req.user.acc_no();
    const { message, transaction } = await transactionService.withdrawal(accNo, req.body);
    res.status(200).send(response(message, transaction));
});

module.exports = { createDepositTransaction, createWithdrawalTransaction, createTransferTransaction };
