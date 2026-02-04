const { fetchTopics } = require("../models/topics-model.js");

// business logic
// filtering

exports.getTopicsService = async () => {
  // if (currentUser.hasPermission(someParameter)) {}
  return await fetchTopics();
  //}
};

// this is where we add validation
