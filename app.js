const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors())

app.use("/", routes);

// default catch all handler
app.all("*", (req, res) =>
  res.status(404).json({ success: false, message: "route not defined" })
);

module.exports = app;
