//jwt library
const jwt = require('jsonwebtoken')

//here we create a middleware name authenticatToken function that runs before route logic.

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];  //reads authorization: Bearer <token>
    const token = authHeader && authHeader.split(" ")[1]; //extract the token

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    }); //check token signature, check expiration, ensure signed by server.
}

module.exports = {
    authenticateToken,
}