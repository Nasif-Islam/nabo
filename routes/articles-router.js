const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
} = require("../controllers/articles-controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

module.exports = articlesRouter;
