const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordsSchema = new Schema({
  userId: String,
  name: String,
  doctor: String,
  date: String,
  complaints: String
});

module.exports = Records = mongoose.model("records", recordsSchema);