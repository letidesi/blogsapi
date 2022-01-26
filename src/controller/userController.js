const userService = require("../service/userService");
const mongoose = require("mongoose");
const { hasPassword } = require("../helpers/bcryptHelpers");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const createUser = async (req, res, next) => {
  try {
    const token = await userService.createUser(req.body);

    return res.status(201).json(token);
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const token = await userService.loginUser(req.body);

    return res.status(200).json(token);
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const usersFound = await userService.listUsers();

    res.status(200).json(usersFound);
  } catch (error) {
    return next(error);
  }
};

const listUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userFound = await userService.listUserById(userId);

    return res.status(200).json(userFound);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);

    res.status(204).json();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  listUsers,
  listUserById,
  deleteUser,
};
