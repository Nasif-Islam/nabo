const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*path", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal Server Error" } = err;
  res.status(status).send({ message: message });
});

module.exports = app;
