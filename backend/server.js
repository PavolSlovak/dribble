const express = require("express");
const cors = require("cors");
const { configDotenv } = require("dotenv");
const { connectDB } = require("./config/db");

configDotenv();
console.log(process.env.NODE_ENV);
const app = express();

connectDB();

app.use(cors());
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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
