const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        amount: {
            type: Number,
            required: [true, 'The transaction amount is required'],
        },
        credit_account: {
            type: mongoose.Types.ObjectId,
            ref: 'accounts',
        },
        debit_account: {
            type: mongoose.Types.ObjectId,
            ref: 'accounts',
        },
        description: {
            type: String,
            required: [true, 'description field is required'],
            minLength: [4, 'name field should be at least 4 characters'],
            maxLength: [256, 'name field should be at most 256 characters'],
            trim: true,
        },
        session_id: {
            type: String,
            required: [true, 'Session id is required'],
        },
        transaction_status: {
            type: 'string',
            enum: ['success', 'failed'],
            required: [true, 'transaction status is required'],
        },
        transaction_type: {
            type: String,
            enum: ['transfer', 'deposit', 'withdrawal'],
        },
        transaction_method: {
            type: String,
            enum: ['money sent', 'money added', 'money removed'],
        },
        transaction_date: {
            type: Date,
            default: Date.now(),
        },
        reversed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

transactionSchema.pre('save', function (next) {
    const transaction_method =
        this.transaction_type === 'transfer'
            ? 'money sent'
            : this.transaction_type === 'deposit'
            ? 'money added'
            : 'money removed';

    this.transaction_method = transaction_method;
    next();
});

transactionSchema.pre('find', function (next) {
    this.populate('credit_account', '-__v -account_balance -references -updated_at -created_at');
    this.populate('debit_account', '-__v -account_balance -references -updated_at -created_at');

    next();
});

const Transaction = mongoose.model('transactions', transactionSchema);

module.exports = Transaction;
