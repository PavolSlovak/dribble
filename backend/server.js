const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

const { corsMiddleware } = require("./middlewares/cors");
dotenv.config();

const app = express();

connectDB();

app.use(corsMiddleware);
app.options("*", corsMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.get("/api/users", async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM users");
    res.status(200).json(response.rows);
  } catch (err) {
    console.error("Error getting users", err);
    res.status(500).json({ message: "Error getting users" });
  }
});
 */
const { router: userRouter } = require("./routes/userRoutes");
const { router: todoRouter } = require("./routes/todoRoutes");

app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);

// Handle root route
app.get("/", (req, res) => {
  res.send("Hello, welcome to the API!");
});
if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}
module.exports = app;
