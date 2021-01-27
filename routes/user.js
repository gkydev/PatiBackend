const router = require('express').Router();
const jwt = require('../app.js').jwt
const db = require('../app.js').db
const { verifyToken } = require('../middlewares/verifyToken')

// Get User Data by Mail in token
router.get('/', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err){
                res.sendStatus(403)
            }
            else {
                var userMail = userData["UserMail"]
                let sql = "SELECT UserId, UserFirstName, UserLastName, UserBirthDate, UserSex, CountyId, UserRole FROM Users WHERE UserMail=?"
                let query = db.query(sql, userMail, (err, result) => {
                    if(err) return err
                    res.json({  
                            UserId : result[0].UserId,
                            UserFirstName: result[0].UserFirstName,
                            UserLastName: result[0].UserLastName,
                            UserBirthDate: result[0].UserBirthDate,
                            UserSex: result[0].UserSex,
                            CountyId: result[0].CountyId,
                            UserRole: result[0].UserRole
                    })
                })
            }
        })
    }   
})

// Update User Data
router.put('/', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err){
                res.sendStatus(403)
            }
            else {
                var UserId = {UserId: userData["UserId"]}
                console.log(UserId)
                var sqlData = {
                    UserFirstName: req.body.UserFirstName,
                    UserLastName: req.body.UserLastName,
                    UserBirthDate: req.body.UserBirthDate,
                    UserSex: req.body.UserSex,
                    CountyId: req.body.CountyId,
                }
                console.log(sqlData)
                let sql = "UPDATE Users SET ? WHERE ?"
                let query = db.query(sql, [sqlData,UserId], (err, result) => {
                    if(err) console.log(err)
                    res.json({  
                            "result": "Done"
                    })
                })
            }
        })
    }   
})

// Get User Data by id
router.get('/data', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err){
                res.sendStatus(403)
            }
            else {
                var userId = req.query.id
                let sql = "SELECT UserId, UserFirstName, UserLastName, UserBirthDate, UserSex, CountyId, UserRole, CityId FROM User_City WHERE UserId=?"
                let query = db.query(sql, userId, (err, result) => {
                    if(err) return err
                    res.json(result[0])
                })
            }
        })
    }   
})
// Get user count 
router.get('/userCount', (req, res) => {
    let sql = "CALL User_Count()"
    let query = db.query(sql, (err, result) => {
        if(err) return console.log(err)
        res.send(result[0][0].userCount.toString())
    })
})

module.exports = router;