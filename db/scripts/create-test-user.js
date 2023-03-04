const sequelize = require("../connect")
const bcrypt = require("bcrypt")
const { User } = require("../models")

bcrypt
	.hash("mynameisroh", 10)
	.then((hashedPwd) => {
		const testUser = User.create({
			firstName: "Muhammad Rohan",
			lastName: "Hussain",
			email: "rohanhussain1@yahoo.com",
			password: hashedPwd,
		})
	})
	.catch((err) => {
		console.log("Could not create user.")
		console.log(err)
	})
