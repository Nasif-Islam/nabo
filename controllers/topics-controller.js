// just handles http

const { getTopicsService } = require("../services/topics-service");

exports.getTopics = async (req, res, next) => {
  const topics = await getTopicsService();
  res.status(200).send({ topics: topics });
};
