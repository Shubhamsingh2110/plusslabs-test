const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).json({ message: "User with given email already exists!" });
    }

    // Create new user
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
      role: "user"  // Set default role
    });

    await user.save();
    console.log("User created successfully:", user);

    res.status(201).json({ 
      message: "User created successfully",
      userId: user._id 
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
});

module.exports = router;
