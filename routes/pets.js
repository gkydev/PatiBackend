const { json } = require('body-parser')
const { db, jwt} = require('../app')
const router = require('express').Router()
const { verifyAddPet, verifyUpdatePet } = require('../schemas')
const { request } = require('express')
const { verifyToken } = require('../middlewares/verifyToken')

// Get one pet by id 
router.get("/", (req, res) => {
    try {
        var petId = req.query.id
        let sql = "SELECT * FROM Pet_Genus WHERE PetId = ?"
        var urls = []
        db.query(sql, [petId], (err, result) => {
            if(err) console.log(err)
            if(result[0] === undefined){
                res.sendStatus(400)
            }
            else {
                res.send(result[0])
            }
            
        })
    }
    catch (err){
        res.sendStatus(400)
    }
})

// Delete pet
router.delete('/', verifyToken, (req, res) => {
    var PetId = req.query.id
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) res.status(403).send("Forbidden")
            var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                let sql = "DELETE FROM Pets WHERE PetId = ?"
                let query = db.query(sql, [PetId], (err, result) => {
                    if(err) throw err;
                    res.sendStatus(200)
                })
    })
}})

// Add Pet 
router.post('/', verifyToken, (req, res) => {
    // Validate data
    const { error } = verifyAddPet(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var sqlData = {ShelterId: req.body.ShelterId,
                    SpeciesId: req.body.SpeciesId,
                    PetName: req.body.PetName,
                    PetWeight: req.body.PetWeight,
                    PetHeight: req.body.PetHeight,
                    PetAdditionInfo: req.body.PetAdditionInfo,
                    PetVaccineInfo: req.body.PetVaccineInfo,
                    PetBirthDate: req.body.PetBirthDate,
                    HasPassport: req.body.HasPassport,
                    PetGender: req.body.PetGender
                }
                let sql = "INSERT INTO Pets SET ?"
                let query = db.query(sql, sqlData, (err, result) => {
                    if(err) throw err;
                    res.json(result.insertId)
                })
            }
    })
}})

// Update pet 
router.put('/', verifyToken, (req, res) => {
    // Validate data
    const { error } = verifyUpdatePet(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) return res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var sqlData = {
                    ShelterId: req.body.ShelterId,
                    SpeciesId: req.body.SpeciesId,
                    PetName: req.body.PetName,
                    PetWeight: req.body.PetWeight,
                    PetHeight: req.body.PetHeight,
                    PetAdditionInfo: req.body.PetAdditionInfo,
                    PetVaccineInfo: req.body.PetVaccineInfo,
                    PetBirthDate: req.body.PetBirthDate,
                    HasPassport: req.body.HasPassport,
                    PetGender: req.body.PetGender
                }
                var petId = {PetId : req.body.PetId}
                let sql = "UPDATE Pets SET ? WHERE ?"
                let query = db.query(sql, [sqlData,petId], (err, result) => {
                    if(err) throw err;
                    res.json(result.insertId)
                })

            }
    })
}})

// Return pet count 
router.get('/petCount', (req, res) => {
    let sql = "CALL Pet_Count()"
    let query = db.query(sql, (err, result) => {
        if(err) return err  
        var count = result[0][0].petCount.toString()
        res.send(count)
        })
})

// Add pet photo
router.post('/photo', (req, res) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'secretkey', (err, petData) => {
            if(err) return res.status(403).send("Forbidden")
            else {
                var UserRole = petData['UserRole']
                if (UserRole === 0 || UserRole === null) return res.status(403).send("Forbidden")
                var petId = req.body.PetId
                var pictureUrl = req.body.PictureUrl
                var data = { PetId : petId, PictureUrl: pictureUrl}
                console.log(data)
                let sql = "INSERT INTO Pictures SET ?"
                db.query(sql, data, (err, result) => {
                    if (err) return console.log(err)
                    res.status(200).send("Success")
                })
            }})
}})

// Get pet photos

router.get('/photo', (req, res) => {
    var petId = req.query.id
    let sql = "SELECT * FROM Pictures WHERE PetId = ?"
    db.query(sql, [petId], (err, result) => {
        if(err) console.log(err)
        res.json(result)
    })
})

// Get multiple pet
router.get('/getPets', (req, res) => {
    if(req.query.genusId === undefined && req.query.speciesId === undefined && req.query.searchTerm == undefined){
        var pageId = +req.query.p
        var min = 0 + pageId*21 -21
        let sql = "SELECT * FROM Pet_Genus LIMIT ? , ?"
        let query = db.query(sql, [min, 21], (err, result) => {
            if(err) return err
            var dataArray = []
            result.forEach(resElement => {
                dataArray.push(resElement)
            });
            res.json(dataArray)
            })      
    }
    else {
        if (req.query.speciesId !== undefined){
            var speciesId = req.query.speciesId
            if (req.query.searchTerm === undefined){
                let sql = "SELECT * FROM Pet_Genus WHERE SpeciesId = ?"
                db.query(sql, [speciesId], (err, result) => {
                    res.json(result)
            })
            }
            else {
                var searchTerm = req.query.searchTerm
                let sql = "SELECT * FROM Pet_Genus WHERE SpeciesId = ? AND SpeciesName LIKE " + db.escape('%'+searchTerm+'%') + " OR PetAdditionInfo LIKE" + db.escape('%'+searchTerm+'%')
                db.query(sql,[speciesId], (err, result) => {
                    console.log(sql)
                    res.json(result)
                })
            }
        }
    
        else if (req.query.genusId !== undefined){
            var genusId = req.query.genusId
            if (req.query.searchTerm === undefined){
                let sql = "SELECT * FROM Pet_Genus WHERE GenusId = ?"
                db.query(sql, [genusId], (err, result) => {
                    res.json(result)
                })
            }
            else {
                var searchTerm = req.query.searchTerm
                let sql = "SELECT * FROM Pet_Genus WHERE GenusId = ? AND SpeciesName LIKE " + db.escape('%'+searchTerm+'%') + " OR PetAdditionInfo LIKE" + db.escape('%'+searchTerm+'%')
                db.query(sql,[genusId], (err, result) => {
                    res.json(result)
                })
            }
            
        }

        else {
            var searchTerm = req.query.searchTerm
            let sql = "SELECT * FROM Pet_Genus WHERE SpeciesName LIKE " + db.escape('%'+searchTerm+'%') + " OR PetAdditionInfo LIKE " + db.escape('%'+searchTerm+'%')
            db.query(sql, (err, result) => {
                if(err) console.log(err)
                console.log(sql)
                res.json(result)
            })
        }
    } 
})



module.exports = router