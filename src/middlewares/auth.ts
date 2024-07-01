import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestWithUser } from "../types";
import { SECRET_KEY } from "../utils/configurate";
import { AUTHORIZATION_NEEDED_MESSAGE, STATUS_UNAUTHORIZED } from "../utils/consts";

export default (req: RequestWithUser, res: Response, next: NextFunction) => {
  const tokenWithBearer = req.cookies.token;

  if (!tokenWithBearer || !tokenWithBearer.startsWith('Bearer ')) {
    next({ message: AUTHORIZATION_NEEDED_MESSAGE, status: STATUS_UNAUTHORIZED })
  } else {
    const token = tokenWithBearer.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, SECRET_KEY);
    } catch(err) {
      next({ message: AUTHORIZATION_NEEDED_MESSAGE, status: STATUS_UNAUTHORIZED });
    }

    req.user = payload as JwtPayload;
    next();
  }
};