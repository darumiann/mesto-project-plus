import { model, Schema } from "mongoose";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import { ObjectId } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { DEFAULT_USER_NAME, DEFAULT_ABOUT_VALUE, DEFAULT_AVATAR_LINK, AUTHORIZATION_NEEDED_MESSAGE, STATUS_UNAUTHORIZED } from "../utils/consts";
import { stat } from "fs";

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>;
};

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: DEFAULT_USER_NAME,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: DEFAULT_ABOUT_VALUE
  },
  avatar: {
    type: String,
    default: DEFAULT_AVATAR_LINK,
    validate: {
      validator: (url: string) => validator.isURL(url),
      message: "Неправильный формат ссылки",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static("findUserByCredentials", function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select("+password").then((user) => {
    if (!user) {
      throw { message: AUTHORIZATION_NEEDED_MESSAGE, status: STATUS_UNAUTHORIZED };
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw { message: AUTHORIZATION_NEEDED_MESSAGE, status: STATUS_UNAUTHORIZED };
      }
      return user;
    });
  });
});

export default model<IUser, UserModel>("User", userSchema);