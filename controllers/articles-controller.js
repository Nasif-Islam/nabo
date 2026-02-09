const {
  getArticlesService,
  getArticleByIdService,
  getArticleCommentsService,
} = require("../services/articles-service");

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await getArticlesService();
    res.status(200).send({ articles: articles });
  } catch (err) {
    next(err);
  }
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

exports.getArticleComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;

    const comments = await getArticleCommentsService(article_id);
    res.status(200).send({ comments: comments });
  } catch (err) {
    next(err);
  }
};
