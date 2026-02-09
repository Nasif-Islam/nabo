const {
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
} = require("../models/articles-model");

exports.getArticlesService = async () => {
  return await fetchArticles();
};

exports.getArticleByIdService = async (article_id) => {
  if (isNaN(article_id) || article_id <= 0) {
    throw { status: 400, msg: "Bad request" };
  }

  const rows = await fetchArticleById(article_id);

  if (rows.length === 0) {
    throw { status: 404, msg: "Article not found" };
  }

  return rows[0];
};

exports.getArticleCommentsService = async (article_id) => {
  if (isNaN(article_id) || article_id <= 0) {
    throw { status: 400, msg: "Bad request" };
  }

  const article = await fetchArticleById(article_id);

  if (article.length === 0) {
    throw { status: 404, msg: "Article not found" };
  }

  return await fetchArticleComments(article_id);
};
