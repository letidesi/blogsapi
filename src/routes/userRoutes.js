const express = require("express");
const router = express.Router();
const { checkToken } = require("../middlewares/auth");
const userController = require("../controller/userController");


router.post("/user", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/user", checkToken, userController.listUsers);
router.get("/user/:id", checkToken, userController.listUserById);
router.delete("/user/:id", checkToken, userController.deleteUser);


module.exports = router;
