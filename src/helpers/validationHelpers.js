const isEmptyOrNull = (value) => !value || value.trim() === "";
const isEmpty = (value) => value.trim() === "";

module.exports = {
  isEmptyOrNull,
  isEmpty,
};
