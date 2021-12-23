const users = require('./users.json');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const accountService = require('../services/account.service');
const connectDB = require('../configuration/db');

connectDB();

/** Populate the database with users  */
const importUsers = async () => {
    try {
        await Account.deleteMany(); // clear the database of any accounts
        await User.deleteMany(); // clear the database of any users

        const createdUsers = await User.insertMany(users);

        const createdAccounts = [];

        for (let user of createdUsers) {
            const account = await accountService.create({ customer: user._id });

            await account.save();

            createdAccounts.push(account);
        }

        console.log('> Users Imported!', { users: createdUsers, accounts: createdAccounts });
        process.exit();
    } catch (error) {
        console.log("< Could'nt import users to the database -", `${error}`);
        process.exit(1);
    }
};

importUsers();
