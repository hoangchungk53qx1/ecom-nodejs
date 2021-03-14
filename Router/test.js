const express = require("express");
const router = express.Router();

router.get("/api", function (req, res) {
  res.json({
    status: "API Works",
    message: "Welcome to USERS API",
  });
});
