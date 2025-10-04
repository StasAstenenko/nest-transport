// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = (req as any).cookies?.token;

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as any;

      (req as any).user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (err) {
      res.clearCookie('token');
    }

    next();
  }
}
