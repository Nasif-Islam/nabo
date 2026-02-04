const articlesRouter = require("express").Router();
const { getArticles } = require("../controller/articles-controller");

articlesRouter("/", getArticles);

module.exports = articlesRouter;
