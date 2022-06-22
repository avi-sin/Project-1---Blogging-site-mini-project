const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

const createBlog = async function (req, res) {
    try {
        let blogData = req.body
        if (Object.keys(blogData).length === 0) {
            return res.status(400).send({ msg: "BAD REQUEST (No data provided in the body)" })
        }

        let authorId = blogData.authorId
        let a = await authorModel.findById({ _id: authorId })

        if (!a) {
            return res.status(400).send({status: false, msg: "Author is not present."})
        } 

        if ( !blogData.isPublished || blogData.isPublished == false ) {
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

        // // to fetch the objects in an array
        // const blogs = await blogModel.find( { isDeleted: false, isPublished: false } )

    
        // if (blogs.length === 0) {  // if there is no document found, i.e., blogs is an empty array
        //     return res.status(404).send({status: false, msg: "No data found."})
        // } else {  // if blogs is not empty
        //     // console.log(blogs);

            let authorId = req.query.authorId
            let category = req.query.category
            let tags = req.query.tags
            let subcategory = req.query.subcategory

            /*
            let a = await blogModel.find({authorId: authorId})
            // console.log(a);
            
            let filter1 = a.filter(x => {return x.category == category})
            console.log(filter1);
            return res.status(200).send({status: true, data: blogs})  // this will return all the docs in an array
            */

            /*
            if ( !authorId && !category ) {
                return res.status(200).send({status: true, data: blogs})
            }
            if ( authorId && !category ) {
                let a = await blogModel.find({authorId: authorId})
                return res.status(200).send({status: true, data: blogs, filteredData: a})
            }
            if ( !authorId && category ) {
                let a = await blogModel.find({category: category})
                return res.status(200).send({status: true, data: blogs, filteredData: a})
            }
            if ( authorId && category ) {
                let a = await blogModel.find({authorId: authorId})    
                let filter1 = a.filter(x => {return x.category == category})
                return res.status(200).send({status: true, data: blogs, filteredData: filter1})
            }
            */

            /*
            let getBlogs = await blogModel.find({ $and: [{ $and: [{ isDeleted: false }, { isPublished: true }] }, { $or: [{ authorid: data.authorid }, { category: { $in: [data.category] } }, { tags: { $in: [data.tags] } }, { subcategory: { $in: [data.subcategory] } }] }] });

            if (getBlogs.length == 0) return res.status(200).send({ status: true, msg: "No such blog exist" });
            res.status(200).send({ status: true, data: getBlogs })
            */

            let getBlogs = await blogModel.find(
                { $and: [
                    { $and: [ { isDeleted: false }, { isPublished: true } ] },
                    { $or: [
                        { authorId: authorId },
                        { category: { $in: [category] } },
                        { tags: { $in: [tags] } },
                        { subcategory: { $in: [subcategory] } } 
                    ]
                    }
                ]
                }
            )

            if (getBlogs.length == 0) return res.status(200).send({ status: true, msg: "No such blog exist" });
            res.status(200).send({ status: true, data: getBlogs })

    // and{ and{9r[] [] []})}

        
    } catch (err) {
        res.status(500).send({msg: err.message})
    }
}


const updateBlog = async function (req, res) {

    let blogId = req.params.blogId;
    let blog = await blogModel.findById(blogId);
  
    if (!blog) {
      return res.status(404).send("No such blog exists");
    } else {
        let title = req.body.title;
        let body = req.body.body;
        let tag = blogData.tag
        let subcategory = blogData.subcategory
        let updatedBlog = await blogModel.updateOne(
            { _id: blogId },
            { $set: { title: title, body: body, isPublished: true, publishedAt: new Date() }, $push: { tags: tag } },
            { new: true } );
        return res.status(201).send({ status: updatedBlog, data: updatedBlog });
    }
};


const deleteBlogById = async function (req, res) {
    try {
      let blogid = req.params.blogId;
    
        let blogIdPresent = await blogModel.findById({_id: blogid})
        if (!blogIdPresent) {
            res.status(404).send({status: false, msg: "This blog doesn't exist."})
        } else {
            if (blogIdPresent.isDeleted == true) {
                return res.status(400).send({status: false, msg: "The blog is already deleted."})
            } else {
                let blogDeleted = await blogModel.findOneAndUpdate(
                { _id: blogid, isDeleted: false},
                {$set: { isDeleted: true , deletedAt: new Date() } },
                {new:true}
                );
                return res.status(200).send({status: true, blogDeleted: blogDeleted})
            }
        }

    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
};


const deleteBlogByQuery = async function (req, res) {
    try {

        let category = req.query.category
        let authorId = req.query.authorId
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        let isPublished = req.query.isPublished

        const deleteByQuery = await blogModel.updateMany(
        { $and: [ {$or: [{ category: category }, { authorId: authorId }, { tag: { $in: [tags] } }, { subcategory: { $in: [tags] } }, { isPublished: true }]} ] },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true })

        console.log(deleteByQuery);
        // if (deleteByQuery.modifiedCount == 0) return res.status(400).send({ status: false, msg: "The Blog is already Deleted" })
        return res.status(200).send({ status: true, msg: deleteByQuery })
    } catch (err) {
        return res.status(500).send({ error: err.message })
    }
}



module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.deleteBlogById = deleteBlogById
module.exports.updateBlog = updateBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery