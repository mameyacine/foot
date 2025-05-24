const mongoose = require("mongoose");
const userAuthSchema = mongoose.Schema({
username: { type: String, required: true, unique: true },
password: { type: String, required: true },

});
const UserAuth = mongoose.models.UserAuth || mongoose.model('UserAuth', userAuthSchema);

module.exports = UserAuth;