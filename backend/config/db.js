const { configDotenv } = require("dotenv");
const { Pool } = require("pg");

configDotenv();

console.log(process.env.USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database");
    const res = await client.query("SELECT NOW()");
    console.log("Server time:", res.rows[0].now);
    client.release();
  } catch (err) {
    console.error("Error connecting to PostgreSQL database", err);
  }
}
module.exports = { pool, connectDB };
