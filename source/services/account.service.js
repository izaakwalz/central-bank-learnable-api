const Account = require('../models/account.model');
const { generateAccountNumber } = require('../utilities/helper');

class AccountService {
	/**
	 * Create account
	 * @param {*} param0
	 * @returns
	 */
	async create({ customer }) {
		const account_number = await this.newAccountNumber(generateAccountNumber());

		const account = await Account.create({ account_number: account_number, account_balance: 0, customer });

		return account;
	}

	/** create a unique account number */
	async newAccountNumber(accountNumber) {
		const isAccount = await Account.exists({ account_number: accountNumber });
		return isAccount ? generateAccountNumber() : generateAccountNumber();
	}

	async findOne(filter, options) {
		const account = await Account.findOne(filter, { created_at: 0, ipdated_at: 0, __v: 0 }).populate(
			'customer',
			options
		);
		return account;
	}
}

module.exports = new AccountService();
