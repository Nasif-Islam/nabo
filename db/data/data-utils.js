const fs = require("fs");
const path = require("path");
const util = require("util");

const COUNTS = {
  USERS: 10,
  ARTICLES: 20,
  TOPICS: 5,
  EMOJIS: 25,

  GENERATE_VOTES: 20,
  GENERATE_REACTIONS: 5,
  GENERATE_USER_TOPICS: 10,
};

const EMOJIS = [
  "😀",
  "🚀",
  "🎉",
  "🔥",
  "🐱",
  "🌮",
  "😂",
  "😍",
  "😎",
  "🤔",
  "😭",
  "🥳",
  "🐶",
  "🦄",
  "🐙",
  "🦕",
  "🌵",
  "🌈",
  "🍕",
  "🍔",
  "🍩",
  "🍺",
  "☕",
  "🥑",
  "⚽",
];

function generateTestEmojiData(numOfRows) {
  const data = [];

  for (let i = 0; i < numOfRows; i++) {
    const record = {
      emoji_id: i + 1,
      emoji: EMOJIS[i % EMOJIS.length],
    };
    data.push(record);
  }

  return data;
}

function generateTestEmojiArticleUserData(
  numOfRows,
  totalUsers,
  totalArticles,
  maxEmojiId,
) {
  const data = [];
  const uniqueSet = new Set();

  while (data.length < numOfRows) {
    const randomUserId = Math.floor(Math.random() * totalUsers) + 1;
    const randomArticleId = Math.floor(Math.random() * totalArticles) + 1;
    const randomEmojiId = Math.floor(Math.random() * maxEmojiId) + 1;
    const uniqueKey = `${randomUserId}-${randomArticleId}-${randomEmojiId}`;

    if (!uniqueSet.has(uniqueKey)) {
      uniqueSet.add(uniqueKey);
      data.push({
        emoji_article_user_id: data.length + 1,
        emoji_id: randomEmojiId,
        username: `user_${randomUserId}`,
        article_id: randomArticleId,
      });
    }

    if (uniqueSet.size >= totalUsers * totalArticles * maxEmojiId) break;
  }

  return data;
}

function generateTestUserTopicData(numOfRows, totalUsers, totalTopics) {
  const data = [];
  const uniqueSet = new Set();

  while (data.length < numOfRows) {
    const userId = Math.floor(Math.random() * totalUsers) + 1;
    const topicId = Math.floor(Math.random() * totalTopics) + 1;
    const uniqueKey = `${userId}-${topicId}`;

    if (!uniqueSet.has(uniqueKey)) {
      uniqueSet.add(uniqueKey);

      data.push({
        user_topic_id: data.length + 1,
        username: `user_${userId}`,
        topic: `topic_${topicId}`,
      });
    }

    if (uniqueSet.size >= totalUsers * totalTopics) break;
  }

  return data;
}

function generateTestUserArticleVotes(numOfRows, totalUsers, totalArticles) {
  const data = [];
  const uniqueSet = new Set();

  while (data.length < numOfRows) {
    const min = -50;
    const max = 50;
    const randomVoteCount = Math.floor(Math.random() * (max - min + 1) + min);
    const randomArticleId = Math.floor(Math.random() * totalArticles) + 1;
    const randomUserId = Math.floor(Math.random() * totalUsers) + 1;
    const uniqueKey = `${randomUserId}-${randomArticleId}`;

    if (!uniqueSet.has(uniqueKey)) {
      uniqueSet.add(uniqueKey);

      data.push({
        user_article_votes_id: data.length + 1,
        username: `user_${randomUserId}`,
        article_id: randomArticleId,
        vote_count: randomVoteCount,
      });
    }

    if (uniqueSet.size >= totalUsers * totalArticles) break;
  }

  return data;
}

function saveDataToFile(fileName, data) {
  const outputDir = path.join(__dirname, "test-data");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, fileName);
  const dataString = util.inspect(data, { compact: false, depth: null }); // saves as JS object syntax instead of JSON (non "" around keys)
  const fileContent = `module.exports = ${dataString};`;

  fs.writeFileSync(filePath, fileContent);

  return filePath;
}

if (require.main === module) {
  const emojis = generateTestEmojiData(COUNTS.EMOJIS);

  saveDataToFile("emojis.js", emojis);

  const reactions = generateTestEmojiArticleUserData(
    COUNTS.GENERATE_REACTIONS,
    COUNTS.USERS,
    COUNTS.ARTICLES,
    COUNTS.EMOJIS,
  );

  saveDataToFile("emoji_article_user.js", reactions);

  const userTopic = generateTestUserTopicData(
    COUNTS.GENERATE_USER_TOPICS,
    COUNTS.USERS,
    COUNTS.TOPICS,
  );

  saveDataToFile("user_topic.js", userTopic);

  const userArticleVotes = generateTestUserArticleVotes(
    COUNTS.GENERATE_VOTES,
    COUNTS.USERS,
    COUNTS.ARTICLES,
  );

  saveDataToFile("user_article_votes.js", userArticleVotes);
}

module.exports = {
  generateTestEmojiData,
  generateTestEmojiArticleUserData,
  generateTestUserTopicData,
  generateTestUserArticleVotes,
  saveDataToFile,
};
