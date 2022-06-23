const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");
const validator = require("email-validator");

const isValid = function (value) {
    if( typeof value === 'undefined' || value === null ) {
        return false
    }
    if( typeof value === 'string' && value.trim().length == 0 ) {
        return false
    }
    return true
}

const createAuthor = async function (req, res) {
    try {
        let authorData = req.body
        let keysArray = Object.keys(authorData)

        if (keysArray.length !== 0) {
            let email = authorData.email
            let validEmail = validator.validate(email)

            if (validEmail == true) {
                let authorFound = await authorModel.findOne({email: email})

                if ( !authorFound ) {
                    let authorCreated = await authorModel.create(authorData)
                    res.status(201).send({status: true, author: authorCreated})
                } else {
                    res.status(400).send({msg: "Email already in use."})
                }

            } else {
                res.status(403).send({status: false, msg: "Email is not valid."})
            }

        } else {
            res.status(400).send({msg: "BAD REQUEST (No data provided in the body)"})
        }
    } catch (err) {
        res.status(500).send({msg: err.message})
    }
}


const loginAuthor = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
        if ( !email || !password ) return res.status(400).send({status: false, msg: "Provide the email and password."})

        let validEmail = validator.validate(email)
        if ( validEmail == false ) return res.status(400).send({ status: false, msg: "Email is not valid."})

        let author = await authorModel.findOne( { email: email, password: password } )
        if ( !author ) return res.status(403).send( { status: false, msg: "Email or password is incorrect."})

        let token = jwt.sign(
            {
                authorId: author._id.toString(),
                project: "Blogging Site Mini Project",
                batch: "Radon"
            },
            "avinash-ajit-manish-nikhilesh"
        )
        res.setHeader("x-api-key", token)
        res.status(200).send({ status: true, token: token})
    } catch (err) {
        res.status(500).send({ status: false, err: err.message })
    }
}



module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor