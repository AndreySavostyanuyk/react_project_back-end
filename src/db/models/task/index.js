const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  Score: String,
  Cost: Number,
  date: String
});

module.exports = Users = mongoose.model("users", usersSchema);