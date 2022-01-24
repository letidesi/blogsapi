const mongoose = require("mongoose");
require("dotenv-safe");
const secret = process.env.SECRET;

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Banco conectado!");
  } catch (e) {
    console.log(`Error: ${e}`);
  }
};
module.exports = {
  connect,
};
