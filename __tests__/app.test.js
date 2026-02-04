const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("Express App Testing", () => {
  describe("GET /invalid-route", () => {
    test("status:404 - when passed a non-existent route", async () => {
      const response = await request(app).get("/invalid-route");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Route not found");
    });
  });

  describe("GET /api/topics", () => {
    test("status:200 - responds with correct topics data", async () => {
      const response = await request(app).get("/api/topics");
      const topics = response.body.topics;

      expect(response.status).toBe(200);

      expect(Array.isArray(topics)).toBe(true);
      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
  });
});
