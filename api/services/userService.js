const User = require("../models/User");

module.exports.getUsers = async (query) => {
  try {
    return await User.find(query);
  } catch (e) {
    throw Error("Error while querying all Users");
  }
};

module.exports.getUserById = async (query) => {
  try {
    return await User.findOne(query);
  } catch (e) {
    throw Error("Error while querying one User");
  }
};

module.exports.createUser = async (user) => {
  try {
    return await user.save();
  } catch (e) {
    throw Error("Error while saving User");
  }
};

module.exports.updateUser = async (query, userData) => {
  try {
    return await User.updateOne(query, userData);
  } catch (e) {
    throw Error("Error while updating User");
  }
};

module.exports.deleteUser = async (query) => {
  try {
    return await User.deleteOne(query);
  } catch (e) {
    throw Error("Error while deleting User");
  }
};