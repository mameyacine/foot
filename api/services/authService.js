// ✅ Correct
const User = require("../models/User");

module.exports.getUserByQuery = async (query) => {
  try {
    const user = await User.findOne(query);
    return user;
  } catch (e) {
    throw new Error("Error while finding user");
  }
};
// crée un user
module.exports.createUser = async (user) => {
try { return await user.save();
} catch(e) { throw Error("Error while create user : " + e);
}
}