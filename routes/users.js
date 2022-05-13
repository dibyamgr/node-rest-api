const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Update User- by id params
router.put("/:id", async (req, res) => {
    // check the userID and if they are admin
    if (req.body.userId === req.params.id || req.user.isAdmin) {
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
// get a user
// follow user
// unfollow user

module.exports = router;