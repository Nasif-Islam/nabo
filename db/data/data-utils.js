function generateEmojiData(numOfRows) {
  const data = [];
  const emojis = [
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

  for (let i = 0; i < numOfRows; i++) {
    const record = {
      emoji_id: i + 1,
      emoji: emojis[i % emojis.length],
    };
    data.push(record);
  }

  return data;
}

module.exports = { generateEmojiData };
