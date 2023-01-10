const newUser = require("./newUser");
const loginUser = require("./loginUser");
const getUserById = require("./getUserById");
const getUserByUsername = require("./getUserByUsername");
const editUser = require("./editUser");
const deleteOwnUser = require("./deleteOwnUser");

module.exports = {
  newUser,
  loginUser,
  getUserById,
  getUserByUsername,
  editUser,
  deleteOwnUser,
};
