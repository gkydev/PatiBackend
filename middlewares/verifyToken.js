const { verifyRegister } = require("../schemas");

function verifyToken(req, res, next){
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // Split space
        const bearer = bearerHeader.split(' ')
        // Get token from array
        const bearerToken = bearer[1]
        // Set the token
        req.token = bearerToken
        // Next middleware
        next();
    }
    else {
        // Forbidden
        res.status(403).send("key error");
    }
}

module.exports.verifyToken = verifyToken