const db = require("../connection");
const format = require("pg-format");
const { createLookup, formatComments } = require("./seed-utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // Table Deletion
  await db.query(`DROP TABLE IF EXISTS emoji_article_user;`);
  await db.query(`DROP TABLE IF EXISTS user_article_votes;`);
  await db.query(`DROP TABLE IF EXISTS user_topic;`);
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
  await db.query(`DROP TABLE IF EXISTS emojis;`);

  // Table Creation
  await db.query(`
    CREATE TABLE users (
      username VARCHAR(255) PRIMARY KEY CHECK (username = LOWER(username) AND username ~ '^[a-z0-9_]+$' AND char_length(username) >= 3 AND username NOT IN ('admin', 'root', 'support', 'api')),
      name VARCHAR(100) NOT NULL CHECK (char_length(name) >= 2 AND name !~ '^\\s*$'), 
      avatar_url VARCHAR(1000) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Default_pfp.svg',
      deleted_at TIMESTAMP DEFAULT NULL,
      delete_strategy VARCHAR(20) DEFAULT 'anonymise' CHECK (delete_strategy IN ('anonymise', 'wipeout'))
    );  
  `);

  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR(50) PRIMARY KEY CHECK (slug = LOWER(slug) AND slug ~ '^[a-z0-9-]+$' AND char_length(slug) > 0),
      description VARCHAR(255) NOT NULL,
      img_url VARCHAR(1000) DEFAULT 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg' CHECK (img_url ~ '^https?://')
    );
  `);

  await db.query(`
    CREATE TABLE emojis (
      emoji_id SERIAL PRIMARY KEY,
      emoji VARCHAR(25) NOT NULL UNIQUE CHECK (char_length(emoji) > 0 AND emoji !~ '\\s')
    );
  `);

  await db.query(`
    CREATE TABLE user_topic (
      user_topic_id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      topic VARCHAR(50) NOT NULL REFERENCES topics(slug) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE (username, topic)
    );
  `);

  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(50) NOT NULL REFERENCES topics(slug) ON DELETE CASCADE ON UPDATE CASCADE,
      author VARCHAR(255) REFERENCES users(username) ON DELETE SET NULL,
      body TEXT NOT NULL CHECK (char_length(body) > 0 AND body ~ '\\S'),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700' CHECK (article_img_url ~ '^https?://'),
      UNIQUE (author, title)
    );
  `);

  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE user_article_votes (
      user_article_votes_id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
      vote_count INT NOT NULL DEFAULT 0,
      UNIQUE (username, article_id)
    );
  `);

  await db.query(`
    CREATE TABLE emoji_article_user (
      emoji_article_user_id SERIAL PRIMARY KEY,
      emoji_id INT NOT NULL REFERENCES emojis(emoji_id) ON DELETE CASCADE,
      username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
      UNIQUE (emoji_id, username, article_id)
    );
  `);

  // Insertion of Data
  const insertUsersDataQuery = format(
    `INSERT INTO users
      (username, name, avatar_url)
    VALUES
      %L;`,
    userData.map((user) => [
      user.username,
      user.name,
      user.avatar_url && user.avatar_url.trim() ? user.avatar_url : null,
    ]),
  );

  const insertTopicsDataQuery = format(
    `INSERT INTO topics
      (slug, description, img_url)
    VALUES
      %L;`,
    topicData.map((topic) => [
      topic.slug,
      topic.description,
      topic.img_url && topic.img_url.trim() ? topic.img_url : null,
    ]),
  );

  await db.query(insertUsersDataQuery);
  await db.query(insertTopicsDataQuery);

  const insertArticlesDataQuery = format(
    `INSERT INTO articles
      (title, topic, author, body, created_at, votes, article_img_url)
    VALUES
      %L
    RETURNING *;`,
    articleData.map((article) => [
      article.title,
      article.topic,
      article.author,
      article.body,
      article.created_at,
      article.votes,
      article.article_img_url && article.article_img_url.trim()
        ? article.article_img_url
        : null,
    ]),
  );

  const articleRows = await db.query(insertArticlesDataQuery);
  const articleIdLookup = createLookup(articleRows.rows, "title", "article_id");
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsDataQuery = format(
    `INSERT INTO comments
      (article_id, body, votes, author, created_at)
    VALUES
      %L;`,
    formattedCommentData.map((comment) => [
      comment.article_id,
      comment.body,
      comment.votes,
      comment.author,
      comment.created_at,
    ]),
  );

  await db.query(insertCommentsDataQuery);
};

module.exports = seed;
