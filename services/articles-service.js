const {
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
  insertComment,
  updateArticleVotes,
} = require("../models/articles-model");

const { validateId, checkExists } = require("../utils/db-validators");

exports.getArticlesService = async (
  sort_by = "created_at",
  order = "desc",
  topic,
) => {
  const normalizedSortBy = sort_by.toLowerCase();
  const normalizedOrder = order.toUpperCase();

  if (topic) {
    await checkExists("topics", "slug", topic);
  }

  return await fetchArticles(normalizedSortBy, normalizedOrder, topic);
};

exports.getArticleByIdService = async (article_id) => {
  validateId(article_id);
  await checkExists("articles", "article_id", article_id);

  const rows = await fetchArticleById(article_id);
  return rows[0];
};

exports.getArticleCommentsService = async (article_id) => {
  validateId(article_id);
  await checkExists("articles", "article_id", article_id);

  return await fetchArticleComments(article_id);
};

exports.postCommentService = async (article_id, username, body) => {
  validateId(article_id);

  if (!username || !body || !username.trim() || !body.trim()) {
    throw { status: 400, msg: "Bad request" };
  }

  await checkExists("articles", "article_id", article_id);
  await checkExists("users", "username", username);

  const rows = await insertComment(article_id, username, body);
  return rows[0];
};

exports.updateArticleVotesService = async (article_id, inc_votes) => {
  validateId(article_id);

  if (isNaN(inc_votes)) {
    throw { status: 400, msg: "Bad request" };
  }

  const rows = await updateArticleVotes(article_id, inc_votes);

  if (rows.length === 0) {
    throw { status: 404, msg: "Article not found" };
  }

  return rows[0];
};
