const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: function() { return !this.googleId; } // Only required if not Google auth
  },
  lastName: { 
    type: String, 
    required: function() { return !this.googleId; } // Only required if not Google auth
  },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return !this.googleId; } // Only required if not Google auth
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  membershipStatus: { type: String, enum: ["gold", "none"], default: "none" },
  googleId: { type: String },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
