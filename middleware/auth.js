const jwt = require("jsonwebtoken");

const tokenSecret = "RANDOM_TOKEN_SECRET";

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodeToken = jwt.verify(token, tokenSecret);
        const userId = decodeToken.userId;
        
        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user ID";
        }
        else {
            next();
        }
    }
    catch {
        res.status(401).json({ error: error || "Requête non authentifiée"});
    }
};