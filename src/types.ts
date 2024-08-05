import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface RequestWithUser extends Request {
  user?: string | JwtPayload;
};

export interface IUserRequest extends Request {
  user?: { _id: string };
};