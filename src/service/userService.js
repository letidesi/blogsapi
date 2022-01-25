const mongoose = require("mongoose");
const UserSchema = require("../models/Users");
const BadRequestException = require("../exception/BadRequestException");
const ConflictException = require("../exception/ConflictException");

const { hasPassword } = require("../helpers/bcryptHelpers");

const { isEmptyOrNull, isEmpty } = require("../helpers/validationHelpers");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

const createUser = async (body) => {
  conflictUser(body.email);

  const password = await hasPassword(body.password);

  const newUser = new UserSchema({
    _id: new mongoose.Types.ObjectId(),
    ...isRequireBody(body),
    password,
  });

  await newUser.save();

  const payload = { id: newUser._id };
  return {
    token: createToken(payload, SECRET),
  };
};

const loginUser = async (body) => {
  const email = isValidationEmail(body.email);
  const password = isValidationPassword(body.password);

  const userExists = await UserSchema.findOne({ email: email });
  if (userExists === null) throw new BadRequestException("Campos inválidos.");

  const passwordCheck = await bcrypt.compare(password, userExists.password);

  if (!passwordCheck)
    throw new BadRequestException("Please enter a valid password!");
  const payload = { id: userExists._id };
  return {
    token: createToken(payload, SECRET),
  };
};

const listUsers = async () => {
  return await UserSchema.find({}, "-password");
};

const listUserById = async (userId) => {
  const userFound = await UserSchema.findById(userId);

  if (userFound === null) throw new BadRequestException("Usuário não existe.");
  return userFound;
};

const deleteUser = async (userId) => {
  const userFound = await listUserById(userId);
  await userFound.delete();
};

const isRequireBody = (body) => {
  const { displayName, email, password, image } = body;

  isValidationEmail(email);
  isValidationPassword(password);
  isValidationDisplayName(displayName);

  return { displayName, email, password, image };
};

const isValidationEmail = (email) => {
  if (isEmpty(email))
    throw new BadRequestException('"email" is not allowed to be empty.');

  if (isEmptyOrNull(email))
    throw new BadRequestException('"email" is required.');

  if (email.indexOf("@") < 0 || email.indexOf(".com") < 0)
    throw new BadRequestException('"email" must be  a valid email.');
  return email;
};

const isValidationPassword = (password) => {
  if (isEmpty(password))
    throw new BadRequestException('"password" is not allowed to be empty.');

  if (isEmptyOrNull(password))
    throw new BadRequestException('"password" is required.');

  if (password.length < 6)
    throw new BadRequestException(
      '"password" length must be at 6 characters long.'
    );

  return password;
};

const isValidationDisplayName = (displayName) => {
  if (isEmptyOrNull(displayName))
    throw new BadRequestException('"displayName" is required.');

  if (displayName.length < 8)
    throw new BadRequestException(
      '"displayName" length must be at leats 8 characters long.'
    );

  return displayName;
};

const conflictUser = async (email) => {
  const userExists = await UserSchema.findOne({ email: email });
  if (userExists) throw new ConflictException("Usuário já existe.");
};

const createToken = (payload = {}, secretOrPrivateKey) => {
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, secretOrPrivateKey, options);
};

module.exports = {
  createUser,
  loginUser,
  listUsers,
  listUserById,
  deleteUser,
};
