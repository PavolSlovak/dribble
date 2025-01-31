const { pool } = require("../config/db");
const getTodos = async (req, res) => {
  const { id } = req.user;
  try {
    /* const response = await pool.query(
      "SELECT * FROM todos WHERE user_id=$1 ORDER BY timestamp DESC",
      [id]
    ); */
    const response = await pool.query(
      "SELECT * FROM todos WHERE user_id=$1 ORDER BY isfavourite DESC, timestamp DESC",
      [id]
    );
    res.status(200).json(response.rows);
  } catch (err) {
    console.error("Error getting todos", err);

    res.status(500).json({ message: "Error getting todos", status: 500 });
  }
};

const createTodo = async (req, res) => {
  try {
    const { description, status } = req.body;
    const isfavourite = false;
    const user_id = req.user.id;
    const response = await pool.query(
      "INSERT INTO todos ( description, status, isfavourite, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [description, status, isfavourite, user_id]
    );

    res.status(200).json(response.rows[0]);
  } catch (err) {
    console.error("Error creating todo", err);
    res.status(500).json({ message: "Error creating todo", status: 500 });
  }
};
const updateTodo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user_id = req.user.id;

    const { description, status, isfavourite } = req.body;
    let query = `UPDATE todos SET `;

    let updateFields = [];
    let updateValues = [];

    if (description) {
      updateFields.push(`description=$${updateValues.length + 1}`);
      updateValues.push(description);
    }
    if (status) {
      updateFields.push(`status=$${updateValues.length + 1}`);
      updateValues.push(status);
    }
    if (req.body.hasOwnProperty("isfavourite")) {
      updateFields.push(`isfavourite=$${updateValues.length + 1}`);
      updateValues.push(isfavourite);
    }

    query +=
      updateFields.join(", ") +
      ` WHERE user_id=$${updateValues.length + 1} AND id=$${
        updateValues.length + 2
      } RETURNING *`;
    updateValues.push(user_id, id);

    if (updateFields.length === 0) {
      return res.status(200).json({ message: "No fields to update" });
    }
    console.log("Testing", query, updateValues);
    const response = await pool.query(query, updateValues);

    res.status(200).json(response.rows[0]);
  } catch (err) {
    console.error("Error updating todo", err);
    res.status(500).json({ message: "Error updating todo", status: 500 });
  }
};
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const response = await pool.query(
      "DELETE FROM todos WHERE user_id=$1 AND id=$2 RETURNING *",
      [user_id, id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found", status: 404 });
    }
    res.status(200).json(response.rows[0]);
  } catch (err) {
    console.error("Error deleting todo", err);
    res.status(500).json({ message: "Error deleting todo", status: 500 });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
