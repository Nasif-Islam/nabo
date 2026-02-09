const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-routers");
const commentsRouter = require("./comments-router");

const apiRouter = require("express").Router();

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
