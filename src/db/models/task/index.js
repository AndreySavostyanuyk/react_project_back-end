const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  login: String,
  password: String
});

module.exports = Users = mongoose.model("users", usersSchema);