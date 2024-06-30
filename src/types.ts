import { Request } from "express";
import { Schema } from "mongoose";

export interface IUserRequest extends Request {
  user?: any;
}