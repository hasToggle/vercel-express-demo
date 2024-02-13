const { Router } = require("express");

const r = Router();

r.get("/", (req, res) =>
  res.json({ success: true, message: "vercel express demo path 🚀" })
);

module.exports = r;
