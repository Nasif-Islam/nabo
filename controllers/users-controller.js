const { fetchTopics } = require("../models/users.model");

exports.getTopics = async (req, res, next) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics: topics });
};
