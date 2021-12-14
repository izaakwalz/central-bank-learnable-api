const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const balanceSchema = new Schema({
	session_id: {
		type: String,
		required: [true, 'Session id is required'],
	},
	previous_balance: {
		type: Number,
		required: [true, 'Previous balance is required'],
	},
	current_balance: {
		type: Number,
		required: [true, 'Current balance amount is required'],
	},
	created_at: { type: Date, default: Date.now() },
});

const accountSchema = new Schema(
	{
		account_number: {
			type: String,
			unique: true,
			required: [true, 'account number is required'],
		},
		account_balance: {
			type: Number,
			requried: [true, 'Account balance  is required'],
		},
		customer: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: [true, 'Customer Id is requried'],
		},
		balance_track: [balanceSchema],
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Account = mongoose.model('accounts', accountSchema);

module.exports = Account;
