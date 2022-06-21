const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

const createBlog = async function (req, res) {
    try {
        let blogData = req.body
        let authorId = blogData.authorId
        let a = await authorModel.findById({ _id: authorId })
        if (!a) {
            return res.status(400).send({status: false, msg: "Author is not present."})
        } 
        if (blogData.isPublished == false) {
            blogData.publishedAt = null
            let blogCreated = await blogModel.create(blogData)
            res.status(201).send({status: true, data: blogCreated})
        } else {
            blogData.publishedAt = new Date()
            let blogCreated = await blogModel.create(blogData)
            res.status(201).send({status: true, data: blogCreated})
        }
    } catch (err) {
        res.status(500).send({msg: err.message})
    }
}

const getBlogs = async function (req, res) {
    try {

        let blogs = await blogModel.find( { isDeleted: false, isPublished: true } )


        if (blogs.length === 0) {
            return res.status(404).send({status: false, msg: "No data found."})
        } else {
            return res.status(200).send({status: true, data: blogs})
        }


    } catch (err) {
        res.status(500).send({msg: err.message})
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs