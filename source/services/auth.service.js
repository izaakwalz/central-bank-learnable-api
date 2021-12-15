const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const userService = require('./user.service');
const ErrorResponse = require('../utilities/error-response');
const { BASE_URL, BCRYPT_SALT } = require('../configuration');

class AuthService {
	async login({ email, password }) {
		if (!email) throw new ErrorResponse('Unauthorized access: email field is required');

		const user = await userService.findOne({ email: email }, '+password');
		if (!user) throw new ErrorResponse('Unathorized access: invalid email or password provided', 404);

		if (!email || !password) throw new ErrorResponse('Unauthorized access: email and password field is required');

		if (user.password === undefined) {
			const link = await this.requestPasswordReset({ email: user.email });
			const message = `Hey ${user.name} you have'nt set your password, Please use the link provided to set your password: Link expires in 5 minutes`;
			return { message, link };
		}
		const isValidPassword = await user.confirmPassword(password);
		if (!isValidPassword) throw new ErrorResponse('Unauthorized access: invalid email or password');

		const token = user.signToken();

		return {
			uid: user._id,
			name: user.name,
			email: user.email,
			active: user.isActive,
			role: user.role,
			token,
		};
	}
	// Sends a reset password mail to user email
	async requestPasswordReset({ email }) {
		let user = await userService.findOne({ email }, '+password_reset');

		if (!user) throw new ErrorResponse('Unauthorized access: please provide a registered email address', 404);

		const code = Math.floor(Math.random() * 10000);
		const token = randomBytes(22).toString('hex');

		const salt = await bcrypt.genSalt(BCRYPT_SALT);
		const hash = await bcrypt.hash(`${code}.${token}`, salt);

		user.password_reset.token = hash;
		user.password_reset.expires_in = Date.now() + 1000 * 60 * 5; // 5min

		const link = `${BASE_URL}/auth/reset-password/${code}/sign?uid=${user._id}&token=${token}`;

		await user.save();

		return link;
	}

	async passwordReset(code, { uid, token }, password) {
		const user = await userService.findOne({ _id: uid }, '+password +password_reset');

		if (!user || user.password_reset.token === undefined)
			throw new ErrorResponse('Unauthorized access: Invalid Link');

		const isValidToken = await bcrypt.compare(`${code}.${token}`, user.password_reset.token);

		const isTimeExpired = Date.now() > new Date(user.password_reset.expires_in).getTime();

		if (isTimeExpired || !isValidToken) {
			throw new ErrorResponse('Unauthorized access: Invalid or expired Link, please request for another link');
		}

		const salt = await bcrypt.genSalt(BCRYPT_SALT);
		user.password = await bcrypt.hash(password, salt);
		user.password_reset.updated_at = Date.now();
		user.password_reset.token = undefined;
		user.password_reset.expires_in = undefined;
		await user.save();

		return;
	}
}

module.exports = new AuthService();
