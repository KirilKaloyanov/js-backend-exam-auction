const { Schema, model } = require("mongoose");

const EMAIL_PATTERN = /[A-Za-z]+@[A-Za-z]+\.[A-Za-z]+/;

//TODO: add user properties and validation according to assignment
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => EMAIL_PATTERN.test(value),
      message: "Email is not valid. Use only english letters.",
    },
  },
  firstName: {
    type: String,
    required: true,
    minlength: [1, "Username must be at least 1 character long"],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [1, "Username must be at least 1 character long"],
  },
  hashedPassword: { type: String, required: true },
});

const User = model("User", userSchema);

module.exports = User;
