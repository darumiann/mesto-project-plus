import { ObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { IUserRequest } from "../types";
import { STATUS_BAD_REQUEST, STATUS_NOT_FOUND, USER_NOT_FOUND_MESSAGE, VALIDATION_ERROR_MESSAGE, STATUS_SUCCESS, INVALID_DATA_MESSAGE, STATUS_USER_EXISTS, USER_EXISTS_MESSAGE, SERVER_ERROR_MESSAGE, SUCCESS_MESSAGE } from "../utils/consts";
import { SECRET_KEY } from "../utils/configurate";

export const getUsers = ( req: Request, res: Response, next: NextFunction ) => {
  User.find({})
    .then((result) => (
      result.length ? res.send(result) : next({})
    ));
};

export const getUserById = ( req: Request, res: Response, next: NextFunction ) => {
  User.findById(req.params.userId)
    .then((result) =>
      result
        ? res.send(result)
        : next({ message: USER_NOT_FOUND_MESSAGE, status: STATUS_NOT_FOUND })
    )
    .catch(() => next({}));
};

export const createUser = ( req: Request, res: Response, next: NextFunction ) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        res.send({ user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next({ message: VALIDATION_ERROR_MESSAGE, status: STATUS_BAD_REQUEST });
        } else if (err.code === 11000) {
          next({ message: USER_EXISTS_MESSAGE, status: STATUS_USER_EXISTS });
        }
        next(err);
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
    .then((result) =>
      res.send({ data: result})
    )
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        next({ message: VALIDATION_ERROR_MESSAGE, status: STATUS_BAD_REQUEST });
      } else if (err.name === "DocumentNotFoundError") {
        next({ message: USER_NOT_FOUND_MESSAGE, status: STATUS_NOT_FOUND });
      }
      next(err);
    });
  };

export const updateUserAvatar = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  const { _id } = req.user!;
  const { avatar } = req.body;

  if (!avatar) {
    next({ message: INVALID_DATA_MESSAGE, status: STATUS_BAD_REQUEST });
  }

  return User.findByIdAndUpdate(
    _id,
    { avatar },
    { runValidators: true, new: true }
  )
    .orFail()
    .then((result) =>
      res.send({ result })
    )
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next({ message: INVALID_DATA_MESSAGE, status: STATUS_BAD_REQUEST });
      } else if (err.name === "DocumentNotFoundError") {
        next({ message: SERVER_ERROR_MESSAGE, status: STATUS_NOT_FOUND });
      }
      next(err);
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
        next({ message: STATUS_BAD_REQUEST, status: STATUS_BAD_REQUEST });
      }
      next(err);
    });
};