const authorModel = require("../models/authorModel")
const validator = require("email-validator");

const createAuthor = async function (req, res) {
    try {
        let authorData = req.body
        let keysArray = Object.keys(authorData)

        if (keysArray.length !== 0) {

            let email = authorData.email
            let validEmail = validator.validate(email)

            if (validEmail == true) {

                let b = await authorModel.find({email: email})

                if (b.length == 0) {
                    let authorCreated = await authorModel.create(authorData)
                    res.status(201).send({status: true, author: authorCreated})
                } else {
                    res.status(400).send({msg: "Email already in use."})
                }

            } else {
                res.status(403).send({status: false, msg: "Email is not valid"})
            }

        } else {
            res.status(400).send({msg: "BAD REQUEST (No data provided in the body)"})
        }
    } catch (err) {
        res.status(500).send({msg: err.message})
    }
}

module.exports.createAuthor = createAuthor