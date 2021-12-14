class ErrorResponse extends Error {
	/**
	 * Create custom error...
	 * @param {*} message Error message for request response
	 * @param {number} statusCode HTTP status code. Default is 400
	 */
	constructor(message, statusCode) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode || 400;
	}
}

module.exports = ErrorResponse;
