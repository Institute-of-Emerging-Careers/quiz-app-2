const bcrypt = require("bcrypt")

bcrypt.hash("deuce9-visa-rope", 10).then(hash=>{
    console.log(hash)
})