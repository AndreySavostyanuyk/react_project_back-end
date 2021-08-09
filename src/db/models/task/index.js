const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  Login: String,
  Password: String
});

module.exports = Users = mongoose.model("users", usersSchema);