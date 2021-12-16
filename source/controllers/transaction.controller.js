const { validationResult } = require('express-validator');
const asyncHandler = require('../middlewares/async-handler');
const transactionService = require('../services/transaction.service');
const userService = require('../services/user.service');
const response = require('../utilities/response');

/** Get user transactions */

const getAllTransactions = asyncHandler(async (req, res) => {
    const accNo = await req.user.acc_no();
    const transtionlist = await transactionService.transactionList(accNo, req.query.type);
    const message = req.query.type
        ? `Transaction staement for ${req.query.type} success`
        : 'Tansaction staement success';
    res.status(200).send(response(message, transtionlist));
});

/**
 * @ {desc} Deposit transaction
 */
const createDepositTransaction = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const error_msg = errors.array().map((error) => error.msg);
    // converts multiple error msg to a single string
    if (!errors.isEmpty()) return res.status(400).send(response(error_msg.join(', '), null, false));
    const accNo = await req.user.acc_no();

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
    if (!errors.isEmpty()) return res.status(400).send(response(error_msg.join(', '), null, false));

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
    if (!errors.isEmpty()) return res.status(400).send(response(error_msg.join(', '), null, false));

    const accNo = await req.user.acc_no(); // account number

    const { message, transaction } = await transactionService.transfer(accNo, req.body);
    res.status(200).send(response(message, transaction));
});

const reportTransaction = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const error_msg = errors.array().map((error) => error.msg);
    // converts multiple error msg to a single string
    if (!errors.isEmpty()) return res.status(400).send(response(error_msg.join(', '), null, false));

    const accNo = await req.user.acc_no(); // account number

    const complain = await transactionService.reportTransaction(accNo, req.body);

    res.status(200).send(response('Transaction reported, pending aproval', complain));
});

const reverseTransaction = asyncHandler(async (req, res) => {
    const data = await transactionService.reverseTransaction(req.params.id, req.body);

    res.status(200).send(response('Transaction approved and revresed', data));
});

module.exports = {
    getAllTransactions,
    createDepositTransaction,
    createWithdrawalTransaction,
    createTransferTransaction,
    reportTransaction,
    reverseTransaction,
};
