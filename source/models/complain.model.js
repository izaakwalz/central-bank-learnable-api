const mongoode = require('mongoose');
const Schema = mongoode.Schema;

const complainSchema = new Schema({
    message: String,
    refrence: String,
    account_no: Number,
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending',
    },
});

const Complain = mongoode.model('complains', complainSchema);

module.exports = Complain;
