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

  describe("GET /api/articles (sorting and ordering queries)", () => {
    test.each(["title", "topic", "author", "votes", "comment_count"])(
      "200: sorts by %s and maintains default descending order",
      async (column) => {
        const { body } = await request(app)
          .get(`/api/articles?sort_by=${column}`)
          .expect(200);

        expect(body.articles).toBeSortedBy(column, { descending: true });
      },
    );

    test("200: order query overrides default DESC but maintains default created_at column", async () => {
      const { body } = await request(app)
        .get("/api/articles?order=asc")
        .expect(200);

      expect(body.articles).toBeSortedBy("created_at", { descending: false });
    });

    test("200: accepts both sort_by and order queries", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200);

      expect(body.articles).toBeSortedBy("title", { descending: false });
    });

    test.each([
      ["sort_by", "hello"],
      ["order", "bye"],
    ])(
      "400: responds with 'Bad request' when passed an invalid %s",
      async (query, value) => {
        const { body } = await request(app)
          .get(`/api/articles?${query}=${value}`)
          .expect(400);

        expect(body.msg).toBe("Bad request");
      },
    );
  });

  describe("GET /api/articles (topic query)", () => {
    test("200: responds with articles filtered by the specified topic", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=cats")
        .expect(200);

      expect(body.articles).toHaveLength(1);
      body.articles.forEach((article) => {
        expect(article.topic).toBe("cats");
      });
    });

    test("200: responds with empty array for topic with no articles", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=paper")
        .expect(200);

      expect(body.articles).toEqual([]);
    });

    test("404: responds with  error message for non-existent topic", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=not_a_topic")
        .expect(404);

      expect(body.msg).toBe("Topic not found");
    });

    test("200: accepts topic, sort_by, and order queries simultaneously", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200);

      expect(body.articles).toHaveLength(12);
      expect(body.articles).toBeSortedBy("title", { descending: false });
      body.articles.forEach((article) => {
        expect(article.topic).toBe("mitch");
      });
    });

    test("404: responds with error for non-existent topic, despite other valid queries are valid", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=not_a_topic&sort_by=votes")
        .expect(404);

      expect(body.msg).toBe("Topic not found");
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

    describe("PATCH /api/articles/:article_id", () => {
      test("200 - returns updated article with incremented votes", async () => {
        const update = { inc_votes: 10 };

        const { body } = await request(app)
          .patch("/api/articles/1")
          .send(update)
          .expect(200);

        expect(body.article.article_id).toBe(1);
        expect(body.article.votes).toBe(110);
      });

      test("200 - returns updated article with decremented votes", async () => {
        const update = { inc_votes: -100 };

        const { body } = await request(app)
          .patch("/api/articles/1")
          .send(update)
          .expect(200);

        expect(body.article.article_id).toBe(1);
        expect(body.article.votes).toBe(0);
      });

      test("404 - responds with an error message for non-existent article_id", async () => {
        const update = { inc_votes: 1 };

        const { body } = await request(app)
          .patch("/api/articles/999")
          .send(update)
          .expect(404);

        expect(body.msg).toBe("Article not found");
      });

      test("400 - responds with an error message for invalid article_id", async () => {
        const update = { inc_votes: 1 };

        const { body } = await request(app)
          .patch("/api/articles/hello")
          .send(update)
          .expect(400);

        expect(body.msg).toBe("Bad request");
      });
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
        const response = await request(app).get("/api/articles/hello/comments");
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

      test("404: Article not found", async () => {
        const newComment = {
          username: "butter_bridge",
          body: "This is a test comment",
        };

        const res = await request(app)
          .post("/api/articles/100/comments")
          .send(newComment)
          .expect(404);

        const { comment } = res.body;

        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Article not found");
      });

      test("400: Invalid article id", async () => {
        const newComment = {
          username: "butter_bridge",
          body: "This is a test comment",
        };

        const res = await request(app)
          .post("/api/articles/hello/comments")
          .send(newComment)
          .expect(400);

        expect(res.body.msg).toBe("Bad request");
      });

      test("404: responds with error when username does not exist", async () => {
        const newComment = {
          username: "ghost_user",
          body: "This is a test comment",
        };
        const { body } = await request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(404);

        expect(body.msg).toBe("User not found");
      });
    });

    describe("DELETE /api/comments/:comment_id", () => {
      test("204: deletes the comment and responds with no content", async () => {
        const { body } = await request(app)
          .delete("/api/comments/1")
          .expect(204);
        expect(body).toEqual({});
      });

      test("404: responds with an error message when trying to delete a non-existent comment", async () => {
        const { body } = await request(app)
          .delete("/api/comments/999")
          .expect(404);

        expect(body.msg).toBe("Comment not found");
      });

      test("400: responds with an error message for an invalid comment_id", async () => {
        const res = await request(app)
          .delete("/api/comments/hello")
          .expect(400);
        expect(res.body.msg).toBe("Bad request");
      });

      test("204: returns 404 error message upon successive delete request", async () => {
        await request(app).delete("/api/comments/1").expect(204);
        await request(app).delete("/api/comments/1").expect(404);
      });
    });
  });
});
