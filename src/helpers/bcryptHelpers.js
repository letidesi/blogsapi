const bcrypt = require("bcrypt");

exports.hasPassword = async (password) => {
  
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
};
