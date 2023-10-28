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
    .withMessage("punctiation symbols are not allowed except -_. in 'shortUrl'"),
];

export const getShortUrl = [
  body("originalUrl")
    .exists()
    .withMessage("'originalUrl' is required")
    .trim()
    .notEmpty()
    .withMessage("'originalUrl' cannot be empty")
    .isURL()
    .withMessage("'originalUrl' must be a valid URL"),

  body("customUrl")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("'customUrl' cannot be empty")
    .matches(/^[A-Za-z0-9-_\.]+$/)
    .withMessage("punctiation symbols are not allowed except -_. in 'customUrl'")
    .custom(async value => {
      return ShortUrlService.getByShortUrl(value).then(
        url => url && Promise.reject("'customUrl' is already taken")
      );
    }),
];
