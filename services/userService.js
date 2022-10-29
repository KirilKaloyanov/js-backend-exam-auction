const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "a45oncuv9pje";

// LOGIN     TODO: check what fields are used for identification by assignment
async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid email or password.");

  const hasMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!hasMatch) throw new Error("Invalid email or password.");

  return createSession(user);
}

// REGISTER   TODO: check what fields are used for identification by assignment
async function register(email, firstName, lastName, password) {
  const existing = await User.findOne({ email });

  if (existing) throw new Error("Email is registered.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    firstName,
    lastName,
    hashedPassword,
  });

  //TODO: check if after registration user needs to login or login is automatic
  return createSession(user);
}

async function getUser(userId) {
  return await User.findById(userId).lean();
}

function logout() {}

function createSession({ _id, email }) {
  const payload = {
    _id,
    email,
  };

  return jwt.sign(payload, JWT_SECRET);
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  login,
  register,
  getUser,
  logout,
  createSession,
  verifyToken,
};
