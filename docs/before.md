# Transcation service

```nodejs
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
			previous_balance: parse_balance,
			current_balance: parse_balance + parse_amount,
			credit_account: account._id,
			transaction_type: 'deposit',
			account: account._id,
		};

		const transaction = await new Transaction(data);

		if (!transaction) throw new ErrorResponse('Transaction not Successfull, please try again later');

		account.account_balance = transaction.current_balance;
		transaction.transaction_status = 'success';
		transaction.session_id = randomBytes(13).toString('hex');

		await transaction.save();
		await account.save();

		transaction.account = undefined;
		account.customer.pin = undefined;

		const details = { transaction, account };

		return { message: 'Transaction Successfull', transaction: details };
	}

	async withdrawal({ accNo, pin, amount }) {
		let account = await accountService.findOne(
			{ account_number: accNo },
			'-__v +pin -isActive -pin_reset -password_reset'
		); // TODO: make use of auth middleware to get logedin user account number deprecating the use of account number in the req.body

		// checking if the user has a transaction pin or not
		if (account.customer.pin === undefined)
			throw new ErrorResponse('Transaction pin not found, please add a transaction pin');

		const isValidPin = hashToken(pin); // check if the hashed pin is equal
		if (isValidPin !== account.customer.pin) throw new ErrorResponse('Pin not correct, try againg');

		const parse_amount = parseFloat(amount).toFixed(4);
		const parse_balance = parseFloat(account.account_balance).toFixed(4);

		if (parse_amount < 200) throw new ErrorResponse('The minimum amount for withdrawl is 200, ');

		// check if withdrawal amount is bigger than the account balance
		if (parse_amount > parse_balance)
			throw new ErrorResponse('Sorry you do not have enough cash to perform this transaction');

		const data = {
			amount: parse_amount,
			description: 'Card ATM',
			previous_balance: parse_balance,
			current_balance: parse_balance - parse_amount,
			debit_account: account._id,
			transaction_type: 'withdrawal',
			account: account._id,
		};

		const transaction = await new Transaction(data);

		if (!transaction) throw new ErrorResponse('Transaction not Successfull, please try again later');

		// account.account_number.
		account.account_balance = transaction.current_balance; // update user account
		transaction.transaction_status = 'success'; // update transaction status
		transaction.session_id = randomBytes(13).toString('hex');

		await transaction.save();
		await account.save();

		transaction.account = undefined;
		account.customer.pin = undefined;

		const details = { transaction, account };

		return { message: 'Transaction Successfull', transaction: details };
	}

```
