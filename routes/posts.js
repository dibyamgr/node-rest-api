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
//like a post
//get a post
//get timeline posts

module.exports = router;