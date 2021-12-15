const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const Account = require('../models/account.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../configuration');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'name field is required'],
            minLength: [5, 'name field should be at least 5 characters'],
            maxLength: [256, 'name field should be at most 256 characters'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'email field is required'],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (value) {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
                },
                message: 'please provide a valid email address',
            },
        },
        phone: {
            type: String,
            required: [true, 'phone number field is required'],
            trim: true,
        },
        password: {
            type: String,
            minLength: [4, 'password field should be at least 4 characters'],
            maxLength: [256, 'password field should be at most 256 characters'],
            select: false,
        },
        pin: {
            type: String,
            select: false,
        },
        gender: String,
        country: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
            select: false,
        },
        pin_reset: {
            token: String,
            expires_in: Date,
            updated_at: Date,
            select: false,
        },
        password_reset: {
            token: String,
            expires_in: Date,
            updated_at: Date,
            select: false,
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

userSchema.pre('find', function (next) {
    this.select('-__V');
    next();
});

userSchema.methods.signToken = function () {
    const token = jwt.sign({ id: this._id, role: this.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token;
};

userSchema.methods.acc_no = async function () {
    const account = await Account.findOne({ customer: this._id });
    return account.account_number;
};

userSchema.methods.confirmPassword = async function (password) {
    const verify = await bcrypt.compare(password, this.password);
    return verify;
};

const Customer = mongoose.model('users', userSchema);

module.exports = Customer;
