// const router = require("express").Router();
// const { User } = require("../models/user");
// const bcrypt = require("bcrypt");
// const Joi = require("joi");

// router.post("/", async (req, res) => {
// 	try {
// 		const { error } = validate(req.body);
// 		if (error)
// 			return res.status(400).send({ message: error.details[0].message });

// 		const user = await User.findOne({ email: req.body.email });
// 		if (!user)
// 			return res.status(401).send({ message: "Invalid Email or Password" });

// 		const validPassword = await bcrypt.compare(
// 			req.body.password,
// 			user.password
// 		);
// 		if (!validPassword)
// 			return res.status(401).send({ message: "Invalid Email or Password" });

// 		const token = user.generateAuthToken();
// 		res.status(200).send({ data: token, message: "logged in successfully" });
// 	} catch (error) {
// 		res.status(500).send({ message: "Internal Server Error" });
// 	}
// });

// const validate = (data) => {
// 	const schema = Joi.object({
// 		email: Joi.string().email().required().label("Email"),
// 		password: Joi.string().required().label("Password"),
// 	});
// 	return schema.validate(data);
// };

// module.exports = router;


const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { googleAuth } = require("../controllers/authController");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		// ✅ Generate JWT Token with Role
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).send({ data: token, role: user.role, message: "Logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// ✅ Get User Data (Including Role)
router.get("/user", async (req, res) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		if (!token) return res.status(401).send({ message: "Access Denied" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select("-password");

		if (!user) return res.status(404).send({ message: "User not found" });

		res.status(200).send({ id: user._id, email: user.email, role: user.role });
	} catch (error) {
		res.status(401).send({ message: "Invalid Token" });
	}
});

// ✅ Validate Email & Password
const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

// Add Google auth route
router.post("/google", googleAuth);

module.exports = router;

