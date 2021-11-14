import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { decryptAccessToken, setAccessToken } from '../util/auth';
import { Loggable } from '../util/loggable';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware extends Loggable implements NestMiddleware {
  //
  private ACCESS_TOKEN_COOKIE = 'AccessToken';

  constructor(private readonly config: ConfigService) {
    super();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies[this.ACCESS_TOKEN_COOKIE];
    if (!accessToken) return next();

    try {
      const jwtSecret = this.config.get('JWT_SECRET');
      const { id, exp } = (await decryptAccessToken(
        jwtSecret,
        req,
      )) as JwtPayload;

      const now = Math.floor(Date.now() / 1000);
      const standardDay = 2;
      if (exp - now >= 60 * 60 * 24 * standardDay) {
        return next();
      }

      await setAccessToken({ id }, jwtSecret, res);
      next();
    } catch {
      next();
    }
  }
}
