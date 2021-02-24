const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const rateLimit = require("express-rate-limit");

const numberTry = rateLimit({
    windowMs: 0.5 * 60000,  // 30 sec
    max: 5,                 // nombre de tentative
    message:
    "Trop de tentative de connexion... Veuillez réessayer un peu plus tard, merci."
});


router.post("/signup", userCtrl.signup);
router.post("/login", numberTry, userCtrl.login);

module.exports = router;