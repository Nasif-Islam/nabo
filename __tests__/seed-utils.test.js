const { createLookup, formatComments } = require("../db/seeds/seed-utils");

describe("createLookup", () => {
  test("returns an empty object when passed an empty array as the input argument", () => {
    input = [];
    const output = createLookup(input, "title", "id");
    const expectedOutput = {};

    expect(output).toEqual(expectedOutput);
  });

  test("creates a lookup object with the correct key-value pairs", () => {
    const input = [
      { id: 1, name: "vel", words: 5 },
      { id: 2, name: "ant", words: 1 },
    ];
    const output = createLookup(input, "name", "id");
    const expectedOutput = {
      vel: 1,
      ant: 2,
    };

    expect(output).toEqual(expectedOutput);
  });

  test("does not mutate the original input array", () => {
    const input = [
      { id: 1, name: "vel" },
      { id: 2, name: "ant" },
    ];
    const inputCopy = [
      { id: 1, name: "vel" },
      { id: 2, name: "ant" },
    ];

    createLookup(input, "name", "id");
    expect(input).toEqual(inputCopy);
  });
});

describe("formatComments function", () => {
  test("returns an empty array when given invalid arguments", () => {
    expect(formatComments([], { Article: 1 })).toEqual([]);

    expect(
      formatComments([{ article_title: "Test", body: "Comment" }], {}),
    ).toEqual([]);

    expect(formatComments([], {})).toEqual([]);

    expect(
      formatComments([{ article_title: "Article A", body: "Comment" }], {
        "Article B": 1,
      }),
    ).toEqual([]);
  });

  test("does not mutate the original inputs", () => {
    const comments = [{ article_title: "Test", body: "Comment" }];
    const idLookup = { "Article A": 1 };

    formatComments(comments, idLookup);

    expect(comments).toEqual([{ article_title: "Test", body: "Comment" }]);
    expect(idLookup).toEqual({ "Article A": 1 });
  });

  test("returns the correct output for a single comment", () => {
    const comments = [
      {
        article_title: "Living in the shadow of a great man",
        body: "Interesting article!",
        author: "butter_bridge",
        votes: 16,
        created_at: "2020-07-09T20:11:00.000Z",
      },
    ];

    const idLookup = {
      "Living in the shadow of a great man": 1,
    };

    const result = formatComments(comments, idLookup);

    expect(result).toEqual([
      {
        article_id: 1,
        body: "Interesting article!",
        author: "butter_bridge",
        votes: 16,
        created_at: "2020-07-09T20:11:00.000Z",
      },
    ]);
  });

  test("returns the correct output for multiple comments", () => {
    const comments = [
      {
        article_title: "Living in the shadow of a great man",
        body: "First comment",
        author: "butter_bridge",
        votes: 16,
      },
      {
        article_title: "Sony Vaio; or, The Laptop",
        body: "Second comment",
        author: "icellusedkars",
        votes: 10,
      },
      {
        article_title: "Eight pug gifs that remind me of mitch",
        body: "Third comment",
        author: "rogersop",
        votes: 5,
      },
    ];
    const idLookup = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3,
    };

    const result = formatComments(comments, idLookup);

    expect(result).toEqual([
      {
        article_id: 1,
        body: "First comment",
        author: "butter_bridge",
        votes: 16,
      },
      {
        article_id: 2,
        body: "Second comment",
        author: "icellusedkars",
        votes: 10,
      },
      {
        article_id: 3,
        body: "Third comment",
        author: "rogersop",
        votes: 5,
      },
    ]);
  });

  test("filters out comments that do not have an associated article in the lookup", () => {
    const comments = [
      {
        article_title: "Living in the shadow of a great man",
        body: "Valid comment",
        author: "butter_bridge",
        votes: 16,
      },
      {
        article_title: "Non-existent Article",
        body: "This should be filtered out",
        author: "icellusedkars",
        votes: 10,
      },
      {
        article_title: "Sony Vaio; or, The Laptop",
        body: "Another valid comment",
        author: "rogersop",
        votes: 5,
      },
    ];
    const idLookup = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
    };

    const result = formatComments(comments, idLookup);

    expect(result).toEqual([
      {
        article_id: 1,
        body: "Valid comment",
        author: "butter_bridge",
        votes: 16,
      },
      {
        article_id: 2,
        body: "Another valid comment",
        author: "rogersop",
        votes: 5,
      },
    ]);
    expect(result).toHaveLength(2);
  });
});
