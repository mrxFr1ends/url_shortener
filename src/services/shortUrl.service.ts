import { generateRandomString } from "../utils";
import { ShortUrl } from "./../models/shortUrl.model";

class ShortUrlService {
  async getByShortUrl(shortUrl: string) {
    return ShortUrl.findOne({ where: { shortUrl } }).then(
      value => value && value.dataValues
    );
  }

  async create(originalUrl: string, customUrl?: string) {
    return customUrl !== undefined
      ? ShortUrl.create({ originalUrl, shortUrl: customUrl }).then(
          result => result.dataValues
        )
      : this.generateShortUrl(8)
          .then(shortUrl => ShortUrl.create({ originalUrl, shortUrl }))
          .then(result => result.dataValues);
  }

  private async generateShortUrl(minLength: number) {
    let length = minLength;
    while (true) {
      const shortUrl = generateRandomString(length);
      if (!(await this.getByShortUrl(shortUrl))) return shortUrl;
      length++;
    }
  }
}

export default new ShortUrlService();
