const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
} = require("../controllers/articles-controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getArticleComments);

articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
