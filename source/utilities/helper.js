const { createHash } = require('crypto');

/**
 * Creates a 10 digit account number starting from 2
 * @returns number
 */
exports.generateAccountNumber = () => {
	const accountNumber = Math.floor(2100000000 + Math.random() * 0100000000).toString();

	return parseInt(accountNumber);
};
/**
 * Create a Hash
 * @param {*} token - data to hash
 * @returns hash
 */
exports.hashToken = (token) => {
	const hashedToken = createHash('sha512').update(token).digest('hex');
	return hashedToken;
};
