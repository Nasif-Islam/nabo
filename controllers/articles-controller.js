const {
  getArticlesService,
  getArticleByIdService,
} = require("../services/articles-service");

exports.getArticles = async (req, res, next) => {
  const articles = await getArticlesService();
  res.status(200).send({ articles: articles });
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;

    const article = await getArticleByIdService(article_id);
    res.status(200).send({ article: article });
  } catch (err) {
    next(err);
  }
};
