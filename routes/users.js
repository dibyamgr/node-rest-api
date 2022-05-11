const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Update User
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
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
// get a user
// follow user
// unfollow user

module.exports = router;