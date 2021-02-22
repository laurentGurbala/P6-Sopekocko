const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée ! "}))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};
    console.log(sauceObject);

    // TODO : SUPPRIMER L'IMAGE PRECEDENTE DU DOSSIER

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !"}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, ()=> {
            Sauce.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: "Sauce supprimée !"}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(400).json( { error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json( sauce ))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.addVote = (req, res) => {

    // Chercher la sauce dans la BDD
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        
        // Traitement du vote
        switch(req.body.like){
            case 1:
                // Si l'utilisateur n'as pas déjà voté (pas utile like : 0)
                if (!sauce.usersLiked.includes(req.body.userId) && (!sauce.usersDisliked.includes(req.body.userId))) {
                    // Ajoute l'utilisateur dans le tableau de ceux qui ont "like" la sauce
                    sauce.usersLiked.push(req.body.userId);
                    // Update le compteur de like
                    sauce.likes = sauce.usersLiked.length;
                }

            break;
            
            case -1:
                
                // Si l'utilisateur n'as pas déjà voté
                if (!sauce.usersLiked.includes(req.body.userId) && (!sauce.usersDisliked.includes(req.body.userId))) {

                    // Ajoute l'utilisateur dans le tableau de ceux qui ont "like" la sauce
                    sauce.usersDisliked.push(req.body.userId);
                    // Update le compteur de like
                    sauce.dislikes = sauce.usersDisliked.length;
                }
                
            break;
        }

        // sauce.save au lieu de update one( updateone utile lors des objets anonymes)
        sauce.save()
        .then(() => res.status(200).json({ message: "Vote enregistré !"}))
        .catch(error => {
            res.status(400).json({ error : error });
            console.log(error);
        } );
    })
    .catch(error => res.status(404).json({ error : error }));
};