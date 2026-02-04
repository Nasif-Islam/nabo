const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, msg = "Internal Server Error" } = err;
  res.status(status).send({ message: messages });
});

module.exports = app;
