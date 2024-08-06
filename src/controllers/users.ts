import { ObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { IUserRequest } from "../types";
import CustomError from "../errors/customError";
import { STATUS_BAD_REQUEST, STATUS_NOT_FOUND, USER_NOT_FOUND_MESSAGE, VALIDATION_ERROR_MESSAGE, STATUS_SUCCESS, INVALID_DATA_MESSAGE, STATUS_USER_EXISTS, USER_EXISTS_MESSAGE, SERVER_ERROR_MESSAGE, SUCCESS_MESSAGE, USERS_NOT_FOUND_MESSAGE, WRONG_EMAIL_PASSWORD_MESSAGE } from "../utils/consts";
import { SECRET_KEY } from "../utils/configurate";

export const getUsers = ( req: Request, res: Response, next: NextFunction ) =>
  User.find({})
    .then((users) => res.status(STATUS_SUCCESS).send({ users }))
    .catch(next);

const getUserHandler = (id: string) => (req: Request, res: Response, next: NextFunction) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  User.findById({ _id: id })
    .orFail()
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CustomError(STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE));
      } else if (err.name === 'DocumentNotFoundError') {
        return next(new CustomError(STATUS_BAD_REQUEST, USER_NOT_FOUND_MESSAGE));
      }
      return next(err);
    });

export const getUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user!;
  return getUserHandler(_id)(req, res, next);
};

export const getUserById = ( req: Request, res: Response, next: NextFunction ) => {
  const id = req.params.userId;
  return getUserHandler(id)(req, res, next);
};

export const createUser = ( req: Request, res: Response, next: NextFunction ) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(STATUS_SUCCESS).send({ user: userWithoutPassword });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new CustomError(STATUS_BAD_REQUEST, VALIDATION_ERROR_MESSAGE));
        } else if (err.code === 11000) {
          return next(new CustomError(STATUS_USER_EXISTS, USER_EXISTS_MESSAGE));
        }
        return next(err);
      }));
};

export const updateUser = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  const { _id } = req.user!;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    _id,
    { name, about },
    { runValidators: true, new: true }
  )
    .orFail()
    .then((user) =>
      res.status(STATUS_SUCCESS).send({ data: user})
    )
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new CustomError(STATUS_BAD_REQUEST, VALIDATION_ERROR_MESSAGE));
      } else if (err.name === "DocumentNotFoundError") {
        return next(new CustomError(STATUS_NOT_FOUND, USER_NOT_FOUND_MESSAGE));
      }
      return next(err);
    });
  };

export const updateUserAvatar = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  const { _id } = req.user!;
  const { avatar } = req.body;

  if (!avatar) {
    next(new CustomError(STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE));
  }

  return User.findByIdAndUpdate(
    _id,
    { avatar },
    { runValidators: true, new: true }
  )
    .orFail()
    .then((user) =>
      res.status(STATUS_SUCCESS).send({ user })
    )
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new CustomError(STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE));
      } else if (err.name === "DocumentNotFoundError") {
        return next(new CustomError(STATUS_NOT_FOUND, SERVER_ERROR_MESSAGE));
      }
      return next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "7d" });
      res.cookie("token", `Bearer ${token}`, { httpOnly: true });
      res.send({ message: SUCCESS_MESSAGE });
    })
    .catch((err: Error) => {
      if (err.name === "ValidationError") {
        return next(new CustomError(STATUS_BAD_REQUEST, WRONG_EMAIL_PASSWORD_MESSAGE));
      }
      return next(err);
    });
};