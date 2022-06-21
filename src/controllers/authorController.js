const authorModel = require("../models/authorModel")

const createAuthor = async function (req, res) {
    try {
        let authorData = req.body
        let authorCreated = await authorModel.create(authorData)

        res.status(201).send({author: authorCreated})
    } catch (err) {
        res.status(500).send({msg: err.message})
    }
}

module.exports.createAuthor = createAuthor