const mongoose = require('mongoose');
const config = require('../configuration');

const connectDB = async () => {
	try {
		const conn = mongoose.connect(config.MONGODB_URI, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log(`> Connected to MongoDB Database :> ${(await conn).connection.host} `);
	} catch (error) {
		console.log("< Could'nt connect to database <:", error.message);
	}
};

module.exports = connectDB;
