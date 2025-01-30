const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authenticateToken");

const express = require("express");

const router = express.Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.put("/update", authenticateToken, updateUser);

router.delete("/delete", authenticateToken, deleteUser);

module.exports = { router };
