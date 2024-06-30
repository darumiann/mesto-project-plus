import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { IUserRequest } from "../types";
import { STATUS_BAD_REQUEST, STATUS_NOT_FOUND, USER_NOT_FOUND_MESSAGE, VALIDATION_ERROR_MESSAGE } from "../utils/consts";

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
  User.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next({ message: VALIDATION_ERROR_MESSAGE, status: STATUS_BAD_REQUEST });
      } else {
        next({});
      };
    });
};

export const updateUser = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { runValidators: true, new: true }
  )
    .then((result) =>
      result
        ? res.send(result)
        : next({ message: USER_NOT_FOUND_MESSAGE, status: STATUS_NOT_FOUND })
    )
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        next({ message: VALIDATION_ERROR_MESSAGE, status: STATUS_BAD_REQUEST });
      } else {
        next({});
      };
    });
};

export const updateUserAvatar = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { runValidators: true, new: true }
  )
    .then((result) =>
      result
        ? res.send(result)
        : next({ message: USER_NOT_FOUND_MESSAGE, status: STATUS_NOT_FOUND })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next({ message: VALIDATION_ERROR_MESSAGE, status: STATUS_BAD_REQUEST });
      } else {
        next({});
      };
    });
};