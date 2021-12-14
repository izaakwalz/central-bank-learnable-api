require('dotenv').config();

const config = {
	production: {
		PORT: process.env.PORT,
		BASE_URL: process.env.BASE_URL,
		MONGODB_URI: process.env.MONGODB_URI,
		BCRYPT_SALT: process.env.BCRYPT_SALT,
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
		ROLES: ['customer', 'officer', 'admin'],
	},
	development: {
		PORT: process.env.PORT || 4000,
		BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT}/api/v1`,
		MONGODB_URI: 'mongodb://localhost/learnable_bank',
		BCRYPT_SALT: process.env.BCRYPT_SALT || 10,
		JWT_SECRET: process.env.JWT_SECRET || 'XX_XXX_XXXX_XXXXX',
		JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '5d', // 5 days
		ROLES: ['customer', 'admin'],
	},
};

//export configuration enviroment
module.exports = config[process.env.NODE_ENV] || config['production'];
