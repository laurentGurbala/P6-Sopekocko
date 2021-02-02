const express = require('express');

const app = express();

// routes
app.use((req, res, next) => {
    console.log("requête bien reçue !");
    next();
});



app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({ message : "Votre requête à bien été reçue"});
    next();
});

app.use((req, res) => {
    console.log("La réponse à été envoyé avec succès");
})

module.exports = app;