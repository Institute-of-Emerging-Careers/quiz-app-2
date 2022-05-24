const getUserById = require('../../get-user-by-id')
const bcrypt = require('bcrypt')

const verifyCorrectCredentials = async(user) => {
    try {
        const passwordCheck = await bcrypt.compare("mynameisroh",user.password)
    } catch(err) {
        console.log("Bcrypt error. Code 1.")
    }
    if (user.firstName == "Muhammad Rohan" && user.lastName == "Hussain" && user.email == "rohanhussain1@yahoo.com" && passwordCheck) {
        console.log("PASSED | get-user-by-Id -> Correct Credentials")
    } else {
        console.log("FAILED | get-user-by-Id -> Correct Credentials | Credentials did not match.")
        if (process.env.DEBUG == true) {
            console.log(err)
        }
    }
}

const verifyIncorrectCredentials = user => {
    if (user==null) {
        console.log("PASSED | get-user-by-Id -> Incorrect Credentials")
    }
}

const test = async() => {
    try {
        // testing with correct Id
        let user = await getUserById(1)
        verifyCorrectCredentials(user)

        // testing with wrong Id
        user = await getUserById(0)
        verifyIncorrectCredentials(user)
    } catch(err) {
        console.log("Test get-user-by-Id failed. Some error occured.")
        if (process.env.DEBUG == true) {
            console.log(err)
        }
    }
}

test()