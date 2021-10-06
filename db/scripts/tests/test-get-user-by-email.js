const getUserByEmail = require('../../get-user-by-email')
const bcrypt = require('bcrypt')

const verifyCorrectCredentials = async(user) => {
    const passwordCheck = await bcrypt.compare("mynameisroh",user.password)
    if (user.firstName == "Muhammad Rohan" && user.lastName == "Hussain" && user.email == "rohanhussain1@yahoo.com" && passwordCheck) {
        console.log("PASSED | get-user-by-email -> Correct Credentials")
    } else {
        console.log("FAILED | get-user-by-email -> Correct Credentials | Credentials did not match.")
        if (process.env.DEBUG == true) {
            console.log(err)
        }
    }
}

const verifyIncorrectCredentials = user => {
    if (user==null) {
        console.log("PASSED | get-user-by-email -> Incorrect Credentials")
    }
}

const test = async() => {
    try {
        // testing with correct email
        let user = await getUserByEmail('rohanhussain1@yahoo.com')
        verifyCorrectCredentials(user)

        // testing with wrong email
        user = await getUserByEmail('rohan@yahoo.com')
        verifyIncorrectCredentials(user)
    } catch(err) {
        console.log("Test get-user-by-email failed. Some error occured.")
        if (process.env.DEBUG == true) {
            console.log(err)
        }
    }
}

test()