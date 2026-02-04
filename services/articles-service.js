const { fetchArticles } = require("../models/articles-model");

exports.getArticlesService = async () => {
  return await fetchArticles();
};
