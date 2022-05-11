const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        // findOne => its only one document inside it with same name
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send("user not found")

        // checking password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send("Password Not Matched");

        res.status(200).json(user);
    } catch (err) {
        console.log(err)
    }

})

module.exports = router;