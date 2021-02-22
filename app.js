const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

require('dotenv').config() // variable sensible env

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const app = express();

// Connexion a la base de donnee
mongoose.connect(`mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.egjx6.mongodb.net/cluster0?retryWrites=true&w=majority`,
    {useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log("Connexion à mongoDB réussie ! "))
    .catch(() => console.log("Connexion à mongoDB échoué ! "));

// Récupération du corps de la requête
app.use(bodyParser.json());

// Config des headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;