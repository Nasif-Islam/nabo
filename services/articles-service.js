const { fetchArticles, fetchArticleById } = require("../models/articles-model");

exports.getArticlesService = async () => {
  return await fetchArticles();
};

exports.getArticleByIdService = async (article_id) => {
  const rows = await fetchArticleById(article_id);

  if (rows.length === 0) {
    throw { status: 404, msg: "Article not found" };
  }

  return rows[0];
};
