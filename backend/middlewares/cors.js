const cors = require("cors");

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

console.log("Environment:", process.env.NODE_ENV); // Check the environment
console.log("Client URL:", process.env.CLIENT_URL); // Check the client URL

const corsMiddleware = cors(corsOptions);
module.exports = { corsMiddleware };
