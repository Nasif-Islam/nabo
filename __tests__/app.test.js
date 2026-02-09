const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("Express App Testing", () => {
  describe("GET /invalid-route", () => {
    test("404 - when passed a non-existent route", async () => {
      const response = await request(app).get("/invalid-route");

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Route not found");
    });
  });

  describe("GET /api/topics", () => {
    test("200 - responds with correct topics data", async () => {
      const response = await request(app).get("/api/topics");
      const topics = response.body.topics;

      expect(response.status).toBe(200);
      expect(Array.isArray(topics)).toBe(true);

      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });

        expect(
          typeof topic.img_url === "string" || topic.img_url === null,
        ).toBe(true);
      });
    });
  });

  describe("GET /api/articles", () => {
    test("200 - responds with correct articles data", async () => {
      const response = await request(app).get("/api/articles");
      const articles = response.body.articles;

      expect(response.status).toBe(200);
      expect(Array.isArray(articles)).toBe(true);

      articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String), // JSON dates = string not date
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });

        expect(
          typeof article.article_img_url === "string" ||
            article.article_img_url === null,
        ).toBe(true);

        expect(article).not.toHaveProperty("body");
      });

      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("200 - responds with correct article object", async () => {
      const response = await request(app).get("/api/articles/1");

      expect(response.status).toBe(200);

      const article = response.body.article;

      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      });
    });

    test("404 - correct message for resource not found'", async () => {
      const response = await request(app).get("/api/articles/100");

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Article not found");
    });
  });

  test("status:400 - correct message for bad request", async () => {
    const response = await request(app).get("/api/articles/hello");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad request");
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("200 - returns all comments", async () => {
      const response = await request(app).get("/api/articles/1/comments");

      expect(response.status).toBe(200);

      const { comments } = response.body;
      expect(comments).toBeSortedBy("created_at", { descending: true });
      expect(Array.isArray(comments)).toBe(true);

      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1,
        });
      });
    });

    test("200 - returns an empty array for articles with no comments", async () => {
      const response = await request(app).get("/api/articles/2/comments");
      expect(response.status).toBe(200);
      expect(response.body.comments).toEqual([]);
    });

    test("404 - correct message for resource not found", async () => {
      const response = await request(app).get("/api/articles/100/comments");
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Article not found");
    });

    test("400 - Bad request", async () => {
      const response = await request(app).get(
        "/api/articles/articles/comments",
      );
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad request");
    });
  });

  describe("GET /api/users", () => {
    test("200 - responds with correct users data", async () => {
      const response = await request(app).get("/api/users");
      const { users } = response.body;

      expect(response.status).toBe(200);
      expect(Array.isArray(users)).toBe(true);

      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
        });

        expect(
          typeof user.avatar_url === "string" || user.avatar_url === null,
        ).toBe(true);
      });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("201, posts a new comment and returns the comment", async () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a test comment",
      };

      const res = await request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201);

      const { comment } = res.body;

      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        body: "This is a test comment",
        article_id: 1,
        author: "butter_bridge",
        votes: 0,
        created_at: expect.any(String),
      });
    });

    test("400: invalid article id", async () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a test comment",
      };

      const res = await request(app)
        .post("/api/articles/100/comments")
        .send(newComment)
        .expect(400);

      const { comment } = res.body;

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Bad request");
    });
  });
});
