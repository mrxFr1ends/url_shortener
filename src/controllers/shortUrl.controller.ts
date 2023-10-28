import { Request, Response } from "express";
import { ShortUrlNotFound } from "../errors";
import ShortUrlService from "../services/shortUrl.service";

class ShortUrlContoller {
  async redirectByShortUrl(req: Request, res: Response) {
    const { shortUrl } = req.params;

    const url = await ShortUrlService.getByShortUrl(shortUrl);
    if (!url) throw new ShortUrlNotFound();

    res.redirect(url.originalUrl);
  }

  async createShortUrl(req: Request, res: Response) {
    const { originalUrl, customUrl } = req.body;

    const baseUrl = new URL(`${req.protocol}://${req.get("host")}`).origin;
    return ShortUrlService.create(originalUrl, customUrl).then(createdUrl => {
      res.status(201).send({
        originalUrl: createdUrl.originalUrl,
        shortUrl: new URL(createdUrl.shortUrl, baseUrl),
      });
    });
  }
}

export default new ShortUrlContoller();
