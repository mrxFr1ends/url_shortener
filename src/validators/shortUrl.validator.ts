import { body, param } from "express-validator";
import ShortUrlService from "../services/shortUrl.service";

export const redirectByShortUrl = [
  param("shortUrl")
    .exists()
    .withMessage("'shortUrl' is required")
    .trim()
    .notEmpty()
    .withMessage("'shortUrl' cannot be empty")
    .matches(/^[A-Za-z0-9-_\.]+$/)
    .withMessage("'shortUrl' cannot contain punctuation symbols except ._-")
];

export const getShortUrl = [
  body("originalUrl")
    .exists()
    .withMessage("'originalUrl' is required")
    .trim()
    .notEmpty()
    .withMessage("'originalUrl' cannot be empty")
    .isLength({ max: 255 })
    .withMessage("'originalUrl' cannot be longer than 255 characters")
    .isURL()
    .withMessage("'originalUrl' must be a valid URL"),

  body("customUrl")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("'customUrl' cannot be empty")
    .isLength({ max: 255 })
    .withMessage("'customUrl' cannot be longer than 255 characters")
    .matches(/^[A-Za-z0-9-_\.]+$/)
    .withMessage("'customUrl' cannot contain punctuation symbols except ._-")
    .custom(async value => {
      return ShortUrlService.getByShortUrl(value).then(
        url => url && Promise.reject("'customUrl' is already taken")
      );
    }),
];
