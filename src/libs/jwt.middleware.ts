import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('JwtRefreshMiddleware');

  constructor(private readonly config: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['AccessToken'];
    if (!accessToken) return next();

    try {
      const jwtSecret = this.config.get('JWT_SECRET');
      const { id, email, exp } = jwt.verify(
        accessToken,
        jwtSecret,
      ) as jwt.JwtPayload;
      const now = Math.floor(Date.now() / 1000);
      const sandardDay = 2;
      if (exp - now >= 60 * 60 * 24 * sandardDay) return next();

      const refreshedAccessToken = jwt.sign({ id, email }, jwtSecret, {
        expiresIn: '3d',
      });
      const refreshDay = 3;
      res.cookie('AccessToken', refreshedAccessToken, {
        maxAge: 1000 * 60 * 60 * 24 * refreshDay,
        httpOnly: true,
      });
      next();
    } catch {
      next();
    }
  }
}
