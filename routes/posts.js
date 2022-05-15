const Post = require("../models/Post");

const router = require("express").Router();

// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err)
    }
})
// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if the post is from the same user
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body
            });
            res.status(200).json("The posts have been updated")
        } else {
            res.status(403).json("You can update only your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The posts have been deleted!!")
        } else {
            res.status(403).json("You can delete only your post")
        }

    } catch (err) {
        res.status(500).json(err)
    }
})
//like a post
router.put("/:id/like", async (req, res) => {
    try {
        // Finding the post by ID
        const post = await Post.findById(req.params.id);
        // checks whether post like array includes this user or not
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("The Post have been liked")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("The post has been disliked")
        }
    } catch (err) {
        res.status(500).json(err);
    }
})
//get a post

//get timeline posts

module.exports = router;