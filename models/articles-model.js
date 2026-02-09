const db = require("../db/connection");

exports.fetchArticles = async (sort_by, order) => {
  const validSortColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrders = ["ASC", "DESC"];

  if (!validSortColumns.includes(sort_by) || !validOrders.includes(order)) {
    throw { status: 400, msg: "Bad request" };
  }

  const sortTarget = sort_by === "comment_count" ? sort_by : `a.${sort_by}`;

  const queryStr = `
    SELECT
      a.article_id, 
      a.title, 
      a.topic, 
      a.author, 
      a.created_at, 
      a.votes,
      a.article_img_url,
      COUNT(c.comment_id)::INT AS comment_count
    FROM
      articles AS a
    LEFT JOIN
      comments AS c ON a.article_id = c.article_id
    GROUP BY
      a.article_id
    ORDER BY
      ${sortTarget} ${order};
  `;

  const { rows } = await db.query(queryStr);
  return rows;
};

exports.fetchArticleById = async (article_id) => {
  const { rows } = await db.query(
    `SELECT
      article_id,
      title,
      topic,
      author,
      body,
      created_at,
      votes,
      article_img_url 
    FROM
      articles
    WHERE
      article_id = $1;`,
    [article_id],
  );

  return rows;
};

exports.fetchArticleComments = async (article_id) => {
  const { rows } = await db.query(
    `SELECT
      comment_id,
      body,
      article_id,
      author,
      votes,
      created_at
    FROM
      comments
    WHERE
      article_id = $1
    ORDER BY
      created_at DESC;
    `,
    [article_id],
  );

  return rows;
};

exports.insertComment = async (article_id, username, body) => {
  const { rows } = await db.query(
    `
    INSERT INTO
      comments (article_id, author, body)
    VALUES
      ($1, $2, $3)
    RETURNING *;
    `,
    [article_id, username, body],
  );

  return rows;
};

exports.updateArticleVotes = async (article_id, inc_votes) => {
  const { rows } = await db.query(
    `
    UPDATE
      articles
    SET
      votes = votes + $1
    WHERE
      article_id = $2
    RETURNING *;
    `,
    [inc_votes, article_id],
  );

  return rows;
};
