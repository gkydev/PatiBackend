const { json } = require('body-parser')
const { db, jwt} = require('../app')
const router = require('express').Router()
const { request } = require('express')
const { verifyToken } = require('../middlewares/verifyToken')

// Get cities

router.get('/cities', (req, res) => {
    let sql = "SELECT * FROM Cities"
    let query = db.query(sql, (err, result) => {
        if(err) return err
        res.json(result)
        })
})

// Get Counties by city id 

router.get('/counties', (req, res) => {
    var cityId = req.query.id
    let sql = "SELECT * FROM Counties WHERE CityId = ?"
    db.query(sql, [cityId], (err, result) => {
        if(err) console.log(err)
        res.json(result)
    })
})

// Add new message
router.post("/contact", (req, res) => {
    let sql = "INSERT INTO Messages SET ?"
    var sqlData = {
        Name : req.body.Name,
        Email : req.body.Email,
        Message : req.body.Message,
        Date : req.body.Date,
        IpAddress : req.body.IpAddress,
    }

    db.query(sql, sqlData, (err, result) => {
        if(err) console.log(err)
        res.sendStatus(200)
    })
})

// Get All Genuses

router.get("/allGenuses", (req, res) => {
    let sql = "SELECT * FROM Genus"
    db.query(sql, (err, result) =>{
        if(err) console.log(err)
        res.json(result)
    })
})

// Get Genus by id 
router.get("/genus", (req, res) => {
    var genuseId = req.query.id
    let sql = "SELECT * FROM Genus WHERE GenusId = ?"
    db.query(sql, [genuseId], (err, result) =>{
        if(err) console.log(err)
        res.json(result[0])
    })
})

// Get Species by GenusId
router.get("/species", (req, res) => {
    var genuseId = req.query.id
    let sql = "SELECT * FROM Species WHERE GenusId = ?"
    db.query(sql, [genuseId], (err, result) =>{
        if(err) console.log(err)
        res.json(result)
    })
})

// Get all species 

router.get("/allSpecies", (req, res) => {
    let sql = "SELECT * FROM Species"
    db.query(sql, (err, result) => {
        if(err) console.log(err)
        res.json(result)

    })
})

// Get Species by species id 

router.get("/getSpecies", (req, res) => {
    var speciesId = req.query.id
    let sql = "SELECT * FROM Species WHERE SpeciesId = ?"
    db.query(sql, [speciesId], (err, result) => {
        if(err) console.log(err)
        res.json(result[0])
    })
})

router.get("/search", (req, res) => {
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
            db.query(sql,[genusId,searchTerm], (err, result) => {
                res.json(result)
            })
        }
        
    }
    else {
        var searchTerm = req.query.searchTerm
        let sql = "SELECT * FROM Pet_Genus WHERE SpeciesName LIKE " + db.escape('%'+searchTerm+'%') + " OR PetAdditionInfo LIKE " + db.escape('%'+searchTerm+'%')
        db.query(sql,[searchTerm], (err, result) => {
            res.json(result)
        })
    }
})

module.exports = router