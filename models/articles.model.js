const db = require("../db/connection");

exports.fetchArticles = async () => {
  const { rows } = await db.query("SELECT * FROM articles;");
  return rows;
};
