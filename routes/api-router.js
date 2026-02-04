const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
// const commentsRouter = require("./comments-router");
// const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

exports.apiRouter.use("/topics", topicsRouter);

exports.apiRouter.use("/articles", articlesRouter);

// apiRouter.use("/comments", commentsRouter);

// apiRouter.use("/users", usersRouter);
