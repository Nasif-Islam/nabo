const topicsRouter = require("./topics-router");
// const commentsRouter = require("./comments-router");
// const articlesRouter = require("./articles-router");
// const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

apiRouter.use("/topics", topicsRouter);

// apiRouter.use("/comments", commentsRouter);

// apiRouter.use("/articles", articlesRouter);

// apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
