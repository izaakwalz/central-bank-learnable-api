const User = require('../models/user.model');
const ErrorResponse = require('../utilities/error-response');
const { hashToken } = require('../utilities/helper');
const accountService = require('./account.service');

class UserService {
    async create({ name, email, phone }) {
        let user = await this.findOne({ email: email });
        if (user) throw new ErrorResponse('This email address is already registerd');

        user = new User({ name, email, phone });

        const account = await accountService.create({ customer: user._id });

        await user.save();
        await account.save();

        return {
            uid: user._id,
            name: user.name,
            email: user.email,
            active: user.isActive,
            role: user.role,
            account,
        };
    }

    async findOne(filter, options) {
        const user = await User.findOne(filter).select(options);
        return user;
    }

    async createPin({ userId, pin }) {
        if (!pin) throw new ErrorResponse('Please enter your pin');

        if (typeof pin !== 'string' || ('number' && `${pin}`.length !== 4))
            throw new ErrorResponse('Pin must be a 4 digit code');

        await User.findByIdAndUpdate(
            userId,
            { pin: hashToken(pin), pin_reset: { updated_at: Date.now() } },
            { runValidators: true }
        );
        return;
    }
}

module.exports = new UserService();
