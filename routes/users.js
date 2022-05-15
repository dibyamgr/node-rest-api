const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Update User- by id params
router.put("/:id", async (req, res) => {
    // check the userID and if they are admin
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        // If user tries to updates password
        if (req.body.password) {
            try {
                // generates the new password in hash
                const salt = await bcrypt.genSalt(10);
                // Update the password
                req.body.password = await bcrypt.hash(req.body.password, salt);

            } catch (err) {
                return res.status(500).send(err)
            }
        }
        try {
            // $set => automatically set all inputs inside this body
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).send("Account has been updated")
        } catch (err) {
            return res.status(500).send(err)
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})
// delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted!!")
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        return res.status(403).json("You can delete only your acccount!!")
    }

})
// get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        // remove unneccessary properties from response
        // spread others properties
        const { password, updatedAt, ...other } = user._doc; //_doc carries all other objects here
        res.status(200).json(other)
    } catch (err) {
        res.status(500).send(err);
    }
})
// follow user
router.put("/:id/follow", async (req, res) => {
    // checked whether these users are same
    console.log(req.body.userId, "UserID");
    console.log(req.params.id, "Params ID")
    if (req.body.userId !== req.params.id) {
        try {
            // find user which has this id which we are trying to follow
            const user = await User.findById(req.params.id);
            // current user which is tring to make a request
            const currentUser = await User.findById(req.body.id);

            // user which we are trying to follow already includes this current user as a follower
            if (!user.followers.includes(req.body.userId)) {
                // $push - because we are going to push some ids inside followers and followings arrays
                await user.updateOne({ $push: { followers: req.body.userId } });
                await user.updateOne({ $push: { follwings: req.body.userId } })
                res.status(200).json("User has been followed!!");
            } else {
                res.status(403).json("You already follow this user!!")
            }
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        // if users are same
        res.status(403).json("You cannot follow yourself")
    }
})
// unfollow user

module.exports = router;