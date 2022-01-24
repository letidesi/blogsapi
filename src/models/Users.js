const mongoose = require("mongoose");

const Users = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,

  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", Users);
