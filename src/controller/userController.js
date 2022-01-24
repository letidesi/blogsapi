const User = require("../models/Users");
const mongoose = require("mongoose");
const { hasPassword } = require("../helpers/auth");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const createUser = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;

    if (displayName.length < 8) {
      return res.status(400).json({
        message: '"displayName" length must be at leats 8 characters long.',
      });
    }
    if (!email) {
      return res.status(400).json({
        message: ' "email" is required.',
      });
    }

    if (email.indexOf("@") < 0 || email.indexOf(".com") < 0) {
      return res.status(400).json({
        message: '"email" must be  a valid email.',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: ' "password" is required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: '"password" length must be at 6 characters long.',
      });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(409).json({
        message: "Usuário já existe.",
      });
    }

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      displayName,
      email,
      password,
      image,
    });

    const passwordHashed = await hasPassword(newUser.password, res);
    newUser.password = passwordHashed;

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      SECRET
    );

    return res.status(201).json({
      token,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: '"email" is required.',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: '"password" is required.',
      });
    }

    if (email.trim() === "") {
      return res.status(400).json({
        message: '"email" is not allowed to be empty.',
      });
    }

    if (password.trim() === "") {
      return res.status(400).json({
        message: '"password" is not allowed to be empty.',
      });
    }

    const checkExistingUser = await User.findOne({ email: email });

    if (checkExistingUser === null) {
      return res.status(400).json({
        message: "Campos inválidos.",
      });
    }

    const passwordCheck = await bcrypt.compare(
      password,
      checkExistingUser.password
    );

    if (!passwordCheck) {
      return res.status(400).json({
        message: "Please enter a valid password!",
      });
    }

    const token = jwt.sign(
      {
        id: checkExistingUser._id,
      },
      SECRET
    );

    return res.status(200).json({
      token,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const listUsers = async (req, res) => {
  try {
    const usersFound = await User.find({}, { password: false });

    res.status(200).json({
      usersFound,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const listUserById = async (req, res) => {
  try {
    const idReq = req.params.id;
    const userFound = await User.findById(idReq, "-password");

    if (userFound === null) {
      return res.status(404).json({
        message: "Usuário não existe.",
      });
    }

    return res.status(200).json({
      userFound,
    });
  } catch (e) {
    res.status(500).json({
      message: "Erro, verifique id ou tente novamente!",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userFound = await User.findById(req.params.me);
    await userFound.delete();

    res.status(204).json();
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  listUsers,
  listUserById,
  deleteUser,
};
