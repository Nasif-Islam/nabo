const db = require("../connection");
const format = require("pg-format");
const {
  convertTimestampToDate,
  createLookup,
  formatComments,
} = require("./seed-utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  const usersTablePromise = db.query(`
    CREATE TABLE users (
      username VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(1000)
    );
    `);
  // avatar_url VARCHAR(1000) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Default_pfp.svg'

  const topicsTablePromise = db.query(`
    CREATE TABLE topics (
      slug VARCHAR(255) PRIMARY KEY,
      description VARCHAR(255) NOT NULL,
      img_url VARCHAR(1000)
    );
    `);
  // img_url VARCHAR(1000) DEFAULT 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg'

  await Promise.all([usersTablePromise, topicsTablePromise]);

  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(255) NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
      author VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
    `);
  // article_img_url VARCHAR(1000) DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'

  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
      `);

  // Insertion of Data
  const insertUsersDataQuery = format(
    `INSERT INTO users
      (username, name, avatar_url)
    VALUES
      %L;`,
    userData.map((user) => {
      return [user.username, user.name, user.avatar_url];
    }),
  );

  const insertTopicsDataQuery = format(
    `INSERT INTO topics
      (slug, description, img_url)
    VALUES
      %L;`,
    topicData.map((topic) => {
      return [topic.slug, topic.description, topic.img_url];
    }),
  );

  await Promise.all([
    db.query(insertUsersDataQuery),
    db.query(insertTopicsDataQuery),
  ]);

  const insertArticlesDataQuery = format(
    `INSERT INTO articles
      (title, topic, author, body, created_at, votes, article_img_url)
    VALUES
      %L
    RETURNING *;`,
    articleData.map((article) => {
      return [
        article.title,
        article.topic,
        article.author,
        article.body,
        article.created_at,
        article.votes,
        article.article_img_url,
      ];
    }),
  );

  const articleRows = await db.query(insertArticlesDataQuery);
  const articleIdLookup = createLookup(articleRows.rows, "title", "article_id");
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsDataQuery = format(
    `INSERT INTO comments
      (article_id, body, votes, author, created_at)
    VALUES
      %L;`,
    formattedCommentData.map((comment) => {
      return [
        comment.article_id,
        comment.body,
        comment.votes,
        comment.author,
        comment.created_at,
      ];
    }),
  );

  return db.query(insertCommentsDataQuery);
};

module.exports = seed;
