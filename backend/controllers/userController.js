const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = "user";

    const hashedPassword = bcrypt.hashSync(password, 10);
    const response = await pool.query(
      ` INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, hashedPassword, role]
    );
    console.log("User created", response.rows[0]);
    res.status(200).json(response.rows[0]);
  } catch (err) {
    console.error("Error creating user", err);
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ message: "Email already exists", status: 409 });
    } else {
      res.status(500).json({ message: "Error creating user", status: 500 });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (response.rows.length === 0) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found", status: 404 });
    }
    console.log("User found", response.rows[0]);
    const user = response.rows[0];

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password", status: 401 });
    }
    // The user is authenticated, so we generate a JWT token
    const generatedToken = jwt.sign(
      {
        id: response.rows[0].id,
        name: response.rows[0].name,
        email: response.rows[0].email,
        password: response.rows[0].password,
        role: response.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ jwtToken: generatedToken });
  } catch (err) {
    console.error("Error logging in user", err);
    res.status(500).json({ message: "Error logging in user", status: 500 });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name, email, password, newPassword } = req.body;
    console.log("body", req.body);
    console.log("User authenticated", req.user);
    const isPasswordValid = bcrypt.compareSync(password, req.user.password);
    console.log("User authenticated", isPasswordValid);
    if (!isPasswordValid || !password) {
      return res.status(401).json({ message: "Invalid password", status: 401 });
    }

    let updateFields = [];
    let updateValues = [];
    let query = `UPDATE users SET `;

    if (newPassword) {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      updateFields.push("password = $" + (updateValues.length + 1));
      updateValues.push(hashedPassword);
    }
    if (name) {
      updateFields.push("name = $" + (updateValues.length + 1));
      updateValues.push(name);
    }
    if (email) {
      updateFields.push("email = $" + (updateValues.length + 1));
      updateValues.push(email);
    }

    // Join creates a string from an array, with a separator
    query +=
      updateFields.join(", ") +
      " WHERE id = $" +
      (updateValues.length + 1) +
      " RETURNING *";
    updateValues.push(req.user.id); // Add the user id to the array

    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ message: "No fields to update", status: 400 });
    }

    const response = await pool.query(query, updateValues);

    console.log("User updated", response.rows[0]);
    res.status(200).json(response.rows[0]);
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).json({ message: "Error updating user", status: 500 });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.user;
  console.log("User authenticated", req.user);
  try {
    const response = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    console.log("User deleted", response.rows[0]);
    res.status(200).json({ message: "User deleted", status: 200 });
  } catch (err) {
    console.error("Error deleting user", err);
    res.status(500).json({ message: "Error deleting user", status: 500 });
  }
};

module.exports = { createUser, loginUser, updateUser, deleteUser };
