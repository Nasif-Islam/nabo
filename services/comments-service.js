const { validateId, checkExists } = require("../utils/db-validators");

const { removeCommentById } = require("../models/comments-model");

exports.deleteCommentService = async (comment_id) => {
  validateId(comment_id);

  await checkExists("comments", "comment_id", comment_id);

  const rows = await removeCommentById(comment_id);
};
