const { json } = require('body-parser')
const { db, jwt} = require('../app')
const router = require('express').Router()
const { request } = require('express')
const { verifyToken } = require('../middlewares/verifyToken')
const { route } = require('./auth')

// SHELTERS

// Get Shelter - XML

router.get("/shelter", (req, res) => {
    var ShelterId = req.query.id
    let sql = "SELECT * FROM Shelter_City WHERE ShelterId = ?"
    let query = db.query(sql, ShelterId, (err, result) => {
        if(err) return res.sendStatus(400)
        res.send(result[0])
    })
})

// Get All Shelters 

router.get("/shelters", (req, res) => {
    let sql = "SELECT * FROM Shelter_City"
    let query = db.query(sql, (err, result) => {
        if(err) return res.sendStatus(400)
        res.send(result)
    })
})

// Add Shelter - XML

router.post('/shelter', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = userData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var sqlData = {
                    ShelterCountyId: req.body.ShelterCountyId,
                    ShelterName: req.body.ShelterName,
                }
                let sql = "INSERT INTO Shelters SET ?"
                let query = db.query(sql, sqlData, (err, result) => {
                    if(err) console.log(err);
                    res.send(result.insertId.toString())
                })
            }
    })
}})

// Delete Shelter - XML

router.delete('/shelter', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = userData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var ShelterId = req.query.ShelterId
                let sql = "DELETE FROM Shelters WHERE ShelterId = ?"
                let query = db.query(sql, ShelterId, (err, result) => {
                    if(err) console.log(err);
                    res.sendStatus(200)
                })
            }
    })
}})

// Add Shelter - XML

router.put('/shelter', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = userData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var ShelterId = req.body.ShelterId
                var sqlData = {
                    ShelterCountyId: req.body.ShelterCountyId,
                    ShelterName: req.body.ShelterName,
                }
                let sql = "UPDATE Shelters SET ? WHERE ShelterId = ?"
                let query = db.query(sql, [sqlData, ShelterId ], (err, result) => {
                    if(err) console.log(err);
                    res.sendStatus(200)
                })
            }
    })
}})
// USERS


// List Users 

router.get('/users', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = userData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                let sql = "SELECT UserId, UserFirstName, UserLastName, UserBirthDate, UserMail, UserMailConfirmed, UserPhoneNumber, UserRegisterIp, UserSex, CountyId, UserRole FROM List_Users"
                db.query(sql, (err, result) => {
                    if(err) console.log(err)
                    res.json(result)
                })
            }
    })
}})

//MESSAGES(contact)

// List of messages

router.get('/contact', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = userData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                let sql = "SELECT * FROM Messages"
                let query = db.query(sql, (err, result) => {
                    if(err) throw err;
                    res.send(result)
                })
            }
    })
}})

// Delete message

router.delete('/contact', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, userData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var messageId = req.query.id
                var UserRole = userData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                let sql = "DELETE FROM Messages WHERE Id = ?"
                let query = db.query(sql, [messageId], (err, result) => {
                    if(err) throw err;
                    res.sendStatus(200)
                })
            }
    })
}})

// GENUS 

// Add Genus

router.post('/genus', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var sqlData = {
                    GenusName: req.body.GenusName
                }
                let sql = "INSERT INTO Genus SET ?"
                let query = db.query(sql, sqlData, (err, result) => {
                    if(err) throw err;
                    res.json(result.insertId)
                })
            }
    })
}})

// Delete genus

router.delete('/genus', verifyToken, (req, res) => {

    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var genusId = req.query.id
                let sql = "DELETE FROM Genus WHERE GenusId = ?"
                let query = db.query(sql, [genusId], (err, result) => {
                    if(err) throw err;
                    res.sendStatus(200)
                })
            }
    })
}})

// Update Genus 

router.put('/genus', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var genusId = req.body.GenusId
                var sqlData = {
                    GenusName: req.body.GenusName
                }
                let sql = "UPDATE Genus SET ? WHERE GenusId = ?"
                let query = db.query(sql, [sqlData,genusId], (err, result) => {
                    if(err) throw err;
                    res.sendStatus(200)
                })
            }
    })
}})

// SPECİES

// Add Species

router.post('/species', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var sqlData = {
                    SpeciesName: req.body.SpeciesName,
                    GenusId: req.body.GenusId
                }
                let sql = "INSERT INTO Species SET ?"
                let query = db.query(sql, sqlData, (err, result) => {
                    if(err) throw err;
                    res.json(result.insertId)
                })
            }
    })
}})

// Update Species

router.put('/species', verifyToken, (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var speciesId = req.body.SpeciesId
                var sqlData = {
                    SpeciesName: req.body.SpeciesName,
                    GenusId: req.body.GenusId
                }
                let sql = "UPDATE Species SET ? WHERE SpeciesId = ?"
                let query = db.query(sql, [sqlData, speciesId], (err, result) => {
                    if(err) throw err;
                    res.sendStatus(200)
                })
            }
    })
}})

// Delete Species

router.delete('/species', verifyToken, (req, res) => {

    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var speciesId = req.query.id
                let sql = "DELETE FROM Species WHERE SpeciesId = ?"
                let query = db.query(sql, [speciesID], (err, result) => {
                    if(err) throw err;
                    res.sendStatus(200)
                })
            }
    })
}})

module.exports = router