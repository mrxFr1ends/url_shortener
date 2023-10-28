import express from "express";
import ShortUrlController from "../controllers/shortUrl.controller";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import {
  getShortUrl,
  redirectByShortUrl,
} from "../validators/shortUrl.validator";
const appRouter = express.Router();

appRouter.get(
  "/:shortUrl",
  validateMiddleware(redirectByShortUrl),
  asyncHandler(ShortUrlController.redirectByShortUrl)
);
appRouter.post(
  "/",
  validateMiddleware(getShortUrl),
  asyncHandler(ShortUrlController.createShortUrl)
);

export default appRouter;
