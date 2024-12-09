const router=require("express").Router();
const User=require("../models/user")
const bcrypt=require("bcrypt")
 

// Register
router.post("/register", async (req, res) => {
    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with the hashed password
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // Save the user and send a response
        const user = await newUser.save();
        res.status(200).json("good to go");
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json("An error occurred");
    }
});

//LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("User not found");
        }

        console.log("Entered Password:", req.body.password);
        console.log("Stored Hashed Password:", user.password);

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json("Invalid password");
        }

        res.status(200).json("Login successful");
    } catch (err) {
        console.error(err);
        res.status(500).json("An error occurred during login");
    }
});






module.exports=router;