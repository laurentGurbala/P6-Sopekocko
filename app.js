const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Sauce = require("./models/sauce");

const app = express();

// Connexion a la base de donnee
mongoose.connect("mongodb+srv://splint:QgwCqDH2iLc84hn@cluster0.egjx6.mongodb.net/cluster0?retryWrites=true&w=majority",
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

// routes

app.post("/api/sauces", (req, res, next) => {
    console.log(req.body);
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée ! "}))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api/sauces/id")

app.get("/api/sauces", (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json({sauces}))
    .catch((error) => res.status(404).json({ error: error + " La sauce n'a pas été trouvé dans la base de donnée !"}));
});

module.exports = app;