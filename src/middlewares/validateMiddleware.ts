import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

export const validateMiddleware = (validationRules: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const rule of validationRules) {
      await rule.run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.formatWith(error => error.msg).mapped(),
        });
    }
    return next();
  };
};
