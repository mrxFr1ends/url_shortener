import request from "supertest";
import app from "../src/app";
import sequelize from "../src/sequelize";

describe("Testing shortUrl", () => {
  const originalUrl = "https://www.google.com";

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe("GET /:shortUrl", () => {
    it("should return 404 error if shortUrl does not exist in database", async () => {
      const response = await request(app).get("/nonexistent");
      expect(response.status).toEqual(404);
    });

    it("should redirect to originalUrl if shortUrl exists in database", async () => {
      const customUrl = "someCustomUrl";

      // Create short link
      await request(app).post("/").send({ originalUrl, customUrl });

      const response = await request(app).get(`/${customUrl}`);

      expect(response.status).toEqual(302);
      expect(response.header.location).toEqual(originalUrl);
    });

    it("should redirect to originalUrl if orignalUrl of 255 long", async () => {
      const customUrl = Array(255).fill('1').join('');

      // Create short link
      await request(app).post("/").send({ originalUrl, customUrl });

      const response = await request(app).get(`/${customUrl}`);

      expect(response.status).toEqual(302);
      expect(response.header.location).toEqual(originalUrl);
    });
  });

  describe("POST /", () => {
    it("should save record with generated short url if custom url is not provided", async () => {
      const req = request(app);
      const baseUrl = req.get("/").url;

      const response = await req.post("/").send({ originalUrl });

      expect(response.status).toEqual(201);
      expect(response.body.originalUrl).toEqual(originalUrl);
      expect(response.body.shortUrl).toMatch(new RegExp(`^${baseUrl}`));
    });

    it("should save record with provided custom url", async () => {
      const req = request(app);
      const baseUrl = req.get("/").url;
      const customUrl = "someCustomUrl";

      const response = await req.post("/").send({
        originalUrl,
        customUrl,
      });

      const expectedResponse = {
        originalUrl,
        shortUrl: `${baseUrl}${customUrl}`
      };
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(expectedResponse);
    });

    it("should return error if customUrl already exists in database", async () => {
      const customUrl = "someCustomUrl";

      // Created first url
      await request(app).post("/").send({ originalUrl, customUrl });

      // Created second url
      const response = await request(app)
        .post("/")
        .send({ originalUrl, customUrl });

      const expectedResponse = {
        message: "Validation failed",
        errors: {
          customUrl: "'customUrl' is already taken",
        },
      };
      expect(response.status).toEqual(400);
      expect(response.body).toEqual(expectedResponse);
    });

    it("should return error if originalUrl is invalid", async () => {
      const invalidOriginalUrl = "htt/google.com";

      const response = await request(app)
        .post("/")
        .send({ originalUrl: invalidOriginalUrl });

      const expectedResponse = {
        message: "Validation failed",
        errors: {
          originalUrl: "'originalUrl' must be a valid URL",
        },
      };
      expect(response.status).toEqual(400);
      expect(response.body).toEqual(expectedResponse);
    });

    it("should return error if customUrl contains invalid characters", async () => {
      const invalidCustomUrl = "myCustom$$$Url";

      const response = await request(app)
        .post("/")
        .send({ originalUrl, customUrl: invalidCustomUrl });

      const expectedResponse = {
        message: "Validation failed",
        errors: {
          customUrl:
            "'customUrl' cannot contain punctuation symbols except ._-",
        },
      };
      expect(response.status).toEqual(400);
      expect(response.body).toEqual(expectedResponse);
    });
  });

  it("should save record with provided custom url of 255 characters long", async () => {
    const req = request(app);
    const baseUrl = req.get("/").url;
    const customUrl = Array(255).fill('1').join('');

    const response = await req.post("/").send({
      originalUrl,
      customUrl,
    });

    const expectedResponse = {
      originalUrl,
      shortUrl: `${baseUrl}${customUrl}`
    };
    expect(response.status).toEqual(201);
    expect(response.body).toEqual(expectedResponse);
  });

  it("should return an error if customUrl is longer than 255 characters", async () => {
    const invalidCustomUrl = Array(256).fill('1').join('');

    const response = await request(app)
      .post("/")
      .send({ originalUrl, customUrl: invalidCustomUrl });

    const expectedResponse = {
      message: "Validation failed",
      errors: {
        customUrl:
          "'customUrl' cannot be longer than 255 characters",
      },
    };
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(expectedResponse);
  });
});
