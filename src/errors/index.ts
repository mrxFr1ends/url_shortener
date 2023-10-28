export class AppError extends Error {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.statusCode = statusCode || 500;
  }
}

export class ShortUrlNotFound extends AppError {
  constructor() {
    super("shortUrl not found", 404);
  }
}
