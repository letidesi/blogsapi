const express = require("express");
const router = express.Router();
const { checkToken } = require("../middlewares/auth");
const userController = require("../controller/userController");

router.use(checkToken);
router.post("/user", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/user", userController.listUsers);
router.get("/user/:id", userController.listUserById);
router.delete("/user/me/:me", userController.deleteUser);

module.exports = router;
