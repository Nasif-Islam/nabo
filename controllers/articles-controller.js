const { getArticlesService } = require("../services/articles-service");

exports.getArticles = async (req, res, next) => {
  const articles = await getArticlesService();
  res.status(200).send({ articles: articles });
};
