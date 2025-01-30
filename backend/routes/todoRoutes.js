const { authenticateToken } = require("../middleware/authenticateToken");
const { getTodos } = require("../controllers/todosController");
const { updateTodo } = require("../controllers/todosController");
const { deleteTodo } = require("../controllers/todosController");
const { createTodo } = require("../controllers/todosController");

const express = require("express");

const router = express.Router();

router.get("/", authenticateToken, getTodos);

router.post("/create", authenticateToken, createTodo);

router.put("/update/:id", authenticateToken, updateTodo);

router.delete("/delete/:id", authenticateToken, deleteTodo);

module.exports = { router };
