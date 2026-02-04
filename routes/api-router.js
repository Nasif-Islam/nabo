const topicsRouter = require("./routes/topics-router.js");
const commentsRouter = require("./routes/comments-router.js");
const articlesRouter = require("./routes/articles-router.js");
const usersRouter = require("./routes/users-router.js");

app.use("/api/topics", topicsRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/users", usersRouter);

module.exports(apiRouter);
