import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_COOKIE = 'AccessToken';

export const setAccessToken = async (
  payload: { id: string },
  jwtSecret: string,
  res: Response,
): Promise<void> => {
  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: '3d',
  });
  const expirationDay = 3;
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * expirationDay,
    httpOnly: true,
  });
};

export const clearAccessToken = async (res: Response): Promise<void> => {
  res.clearCookie(ACCESS_TOKEN_COOKIE);
};

export const decryptAccessToken = async (
  jwtSecret,
  req: Request,
): Promise<JwtPayload | string | undefined> => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
  if (!accessToken) {
    return undefined;
  }
  return jwt.verify(accessToken, jwtSecret) as JwtPayload;
};
