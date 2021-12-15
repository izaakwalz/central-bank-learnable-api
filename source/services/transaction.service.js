const { randomBytes } = require('crypto');

const Transaction = require('../models/transaction.model');
const ErrorResponse = require('../utilities/error-response');
const { hashToken } = require('../utilities/helper');
const accountService = require('./account.service');
const userService = require('./user.service');

class TransactionService {
    async depost({ accNo, pin, amount, description }) {
        let account = await this.isValidAccount(accNo);

        if (account.customer.pin === undefined)
            throw new ErrorResponse('Transaction pin not found, please add a transaction pin');
        const isValidPin = hashToken(pin);
        if (isValidPin !== account.customer.pin) throw new ErrorResponse('Pin not correct, try againg');

        const parse_amount = parseFloat(amount);
        const parse_balance = parseInt(account.account_balance);

        const data = {
            amount: parse_amount,
            description: description,
            credit_account: account._id,
            transaction_type: 'deposit',
            session_id: randomBytes(13).toString('hex'),
        };

        const transaction = await new Transaction(data);

        if (!transaction) throw new ErrorResponse('Transaction not Successfull, please try again later');

        const account_data = {
            credit: parse_amount,
            session_id: transaction.session_id,
            previous_balance: parse_balance,
            current_balance: parse_balance + parse_amount,
            created_at: transaction.transaction_date,
        };

        account.account_balance = account_data.current_balance;
        transaction.transaction_status = 'success';
        account.references.push(account_data);

        await transaction.save();
        await account.save();

        account.customer.pin = undefined;

        const reference = account.references.find((record) => record.session_id === transaction.session_id);

        account.references = reference; // get current

        const details = { transaction, account };

        return { message: 'Transaction Successfull', transaction: details };
    }

    async withdrawal({ accNo, pin, amount }) {
        let account = await this.isValidAccount(accNo);

        // checking if the user has a transaction pin or not
        if (account.customer.pin === undefined)
            throw new ErrorResponse('Transaction pin not found, please add a transaction pin');

        const isValidPin = hashToken(pin); // check if the hashed pin is equal
        if (isValidPin !== account.customer.pin) throw new ErrorResponse('Pin not correct, try againg');

        const parse_amount = parseFloat(amount).toFixed(2);
        const parse_balance = parseFloat(account.account_balance).toFixed(2);

        if (parse_amount < 200) throw new ErrorResponse('The minimum amount for withdrawl is 200');

        // console.log('amount', parse_amount);
        // console.log('balance', parse_balance);

        // check if withdrawal amount is bigger than the account balance
        if (parseInt(parse_amount) > parseInt(parse_balance))
            throw new ErrorResponse('Sorry you do not have enough cash to perform this transaction');

        const data = {
            amount: parse_amount,
            description: 'ATM WITHDRAWAL',
            debit_account: account._id,
            transaction_type: 'withdrawal',
            session_id: randomBytes(13).toString('hex'),
        };

        const transaction = await new Transaction(data);

        if (!transaction) throw new ErrorResponse('Transaction not Successfull, please try again later');

        const account_data = {
            debit: parse_amount,
            session_id: transaction.session_id,
            previous_balance: parse_balance,
            current_balance: parse_balance - parse_amount,
            created_at: transaction.transaction_date,
        };

        account.account_balance = account_data.current_balance;
        transaction.transaction_status = 'success';
        account.references.push(account_data);

        await transaction.save();
        await account.save();

        account.customer.pin = undefined;

        const reference = account.references.find((record) => record.session_id === transaction.session_id);

        account.references = reference;

        const details = { transaction, account };

        return { message: 'Transaction Successfull', transaction: details };
    }

    async transfer({ accNo, creditAccNo, pin, amount, description }) {
        let depositor = await this.isValidAccount(accNo);

        let beneficiary = await this.isValidAccount(creditAccNo);
        beneficiary.customer.pin = undefined;

        if (!beneficiary) throw new ErrorResponse(`Can not find an account with this number ${creditAccNo}`);

        if (account.customer.pin === undefined)
            throw new ErrorResponse('Transaction pin not found, please add a transaction pin');
        const isValidPin = hashToken(pin); //  check if pin matches hash
        if (isValidPin !== account.customer.pin) throw new ErrorResponse('Pin not correct, try againg');

        const parse_amount = parseFloat(amount).toFixed(4);
        const depositor_parse_balance = parseFloat(account.account_balance).toFixed(4);
        const beneficiary_parse_balance = parseFloat(beneficiary.account_balance).toFixed(4);

        const data = {
            amount: parse_amount,
            description: description,
            debit_account: depositor._id,
            credit_account: beneficiary._id,
            transaction_type: 'trnasfer',
            session_id: randomBytes(13).toString('hex'),
        };

        const transaction = await new Transaction(data);

        if (!transaction) throw new ErrorResponse('Transaction not Successfull, please try again later');

        const depositor_data = {
            session_id: transaction.session_id,
            previous_balance: depositor_parse_balance,
            current_balance: depositor_parse_balance - parse_amount,
        };

        const beneficiary_data = {
            session_id: transaction.session_id,
            previous_balance: beneficiary_parse_balance,
            current_balance: beneficiary_parse_balance - parse_amount,
        };

        depositor.account_balance = depositor_data.current_balance; // update user account
        beneficiary.account_balance = beneficiary_data.current_balance; // update user account
        depositor.balance_track.push(depositor_data);
        beneficiary.balance_track.push(beneficiary_data);
        transaction.transaction_status = 'success'; // update transaction status

        await transaction.save();
        await depositor.save();
        await beneficiary.save();

        depositor.customer.pin = undefined;

        const result = {
            transaction,
            depositor,
            beneficiary: { name: beneficiary.name, credit_account: beneficiary.account_number },
        };

        return { message: 'Transaction Successfull', transaction: result };
    }

    async isValidAccount(acountNumber) {
        let account = await accountService.findOne(
            { account_number: acountNumber },
            '-__v +pin -isActive -pin_reset -password_reset'
        ); // TODO: change this to auth user account number deprecating the use of account number in the req.body

        return account;
    }
}

module.exports = new TransactionService();
