const { deleteCommentService } = require("../services/comments-service");

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const comment = await deleteCommentService(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
