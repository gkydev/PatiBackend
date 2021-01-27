const { json } = require('body-parser')
const { verifyLogin, verifyRegister } = require('../schemas')
const { db, jwt} = require('../app')
const bycrypt = require('bcrypt')
const router = require('express').Router()



async function checkMailAsync(userMail){
    return await new Promise((resolve, reject) => {
        let sql = "SELECT UserFirstName FROM Users WHERE UserMail= ?"
        let query = db.query(sql, userMail, (err, result) => {
        if(err) return err ? reject(err) : resolve()
        if(result.length === 0){
            return resolve(false)
        }
        else{
            return resolve(true)
        }
        })
    })    
}

// Login api

router.post('/login', async (req, res) => {
    // Validate data
    const { error } = verifyLogin(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    // Check if the mail exits
    // Check mail
    const emailExist = await checkMailAsync(req.body.Email).then(
        function(result) {
        return result
     })
    if (!emailExist) return res.status(400).send("Mail or pass wrong")
    // Check pass
    let sql = 'SELECT UserPasswordHash, UserRole, UserId FROM Users WHERE UserMail = ?'
    let query = db.query(sql, req.body.Email, async (err, result) => {
        if(err) throw err;
        const passwordCheck = await bycrypt.compare(req.body.Password, result[0].UserPasswordHash)
        if (!passwordCheck) {  
            return res.status(400).send("Mail or pass wrong.")
        }
        else {
            jwt.sign({UserMail: req.body.Email, UserRole: result[0].UserRole, UserId: result[0].UserId}, 'secretkey', { expiresIn: '10000s' },(err, token) => {
                res.send(
                    token
                )
            });
        }
    })
    
})

// Register api

router.post('/register', async (req, res) => {

    var data = {
        UserFirstName: req.body.UserFirstName, 
        UserLastName: req.body.UserLastName, 
        UserBirthDate: req.body.UserBirthDate, 
        UserMail: req.body.UserMail, 
        Password: req.body.Password, 
        UserPhoneNumber: req.body.UserPhoneNumber,
        UserSex: req.body.UserSex,
        CountyId: req.body.CountyId,
    }

    // Check data is in right shape
    const { error } = verifyRegister(data)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if mail exists
    const emailExist = await checkMailAsync(req.body.UserMail).then(
        function(result) {
        return result
     })
    if (emailExist) return res.status(400).send("Bu mail zaten kayıtlı")

    // Hash password
    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(req.body.Password,salt)
    var data = {UserFirstName: req.body.UserFirstName, 
        UserLastName: req.body.UserLastName, 
        UserBirthDate: req.body.UserBirthDate, 
        UserMail: req.body.UserMail, 
        UserPasswordHash: hashedPassword,
        UserPhoneNumber: req.body.UserPhoneNumber,
        CountyId: req.body.CountyId
    }

    // Add new user to database
    let sql = 'INSERT INTO Users SET ?'
    let query = db.query(sql, data, (err, result) => {
        if(err) throw err;
        res.json({"result":"Done"})
    })
})

module.exports = router;