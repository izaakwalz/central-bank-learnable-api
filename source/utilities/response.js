/**
 * Returns response object
 * @param {string} message Response message
 * @param {*} data Data to be returned
 */

const response = (message, data, success) => {
	return {
		success: success == null ? true : success,
		message: formatMesaage(message),
		data: data || null,
	};
};

const formatMesaage = (str) => {
	if (!str) return '';

	// Make the first letter capitial
	return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = response;
