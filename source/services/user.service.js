const User = require('../models/user.model');
const ErrorResponse = require('../utilities/error-response');
const { hashToken } = require('../utilities/helper');
const accountService = require('./account.service');

class UserService {
    /**
     * @method Create User
     * @param {string} name - user's name
     * @param {string} email - user's email
     * @param {string} phone - user's phone
     * @returns {object}
     */
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

    /**
     * @method findOne - user
     * @param {object} filter - search user
     * @param {*} options
     * @returns
     */
    async findOne(filter, options) {
        const user = await User.findOne(filter).select(options);
        return user;
    }

    /**
     * @method Create pin
     * @param {string} = userId,
     * @param {*} - transaction pin
     * @returns
     */
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

    /**
     *@method Disable a user
     * @param {string} userId
     * @returns {object}
     */
    async disable(userId) {
        let user = await this.findOne({ _id: userId });
        if (!user) throw new ErrorResponse(`There is no user with this ID - ${userId}`, 404);

        user.isActive = false;
        await user.save();

        return;
    }

    /**
     * Delete a user
     * @param {*} userId
     * @returns
     */
    async delete(userId) {
        let user = await this.findOne({ _id: userId });

        if (!user) throw new ErrorResponse(`There is no user with this ID - ${userId}`, 404);

        await User.deleteOne({ _id: user._id });

        return;
    }

    async addAdmin({ role, userId }) {
        const user = await User.updateOne({ _id: userId }, { $set: { role } }, { new: true });

        if (!user) throw new ErrorResponse('Error: user dose not exist', 404);
        return user;

        // res.status(200).send(response('Success: user is now an instructor', user));
    }
}

module.exports = new UserService();
