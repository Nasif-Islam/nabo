const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleByID,
} = require("../controllers/articles-controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleByID);

module.exports = articlesRouter;
