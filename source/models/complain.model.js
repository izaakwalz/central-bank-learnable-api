const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complainSchema = new Schema({
    message: String,
    refrence: String,
    account_no: Number,
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending',
        required: [true, 'Complain staus is requried'],
    },
    transId: {
        type: mongoose.Types.ObjectId,
        ref: 'transactions',
    },
});

complainSchema.pre('find', function (next) {
    this.populate('transId', '-__v -created_at -updated_at');
    next();
});

const Complain = mongoose.model('complains', complainSchema);

module.exports = Complain;
