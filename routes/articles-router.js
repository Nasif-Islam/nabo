const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  updateArticleVotes,
} = require("../controllers/articles-controller");

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articlesRouter;
