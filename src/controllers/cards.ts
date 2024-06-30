import { NextFunction, Request, Response } from "express";
import { IUserRequest } from "../types";
import Card from "../models/card";
import { CARDS_NOT_FOUND_MESSAGE, INVALID_DATA_MESSAGE, SERVER_ERROR_MESSAGE, STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_SERVER_ERROR } from "../utils/consts";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((result) => (result.length ? res.send(result) : next({})))
    .catch(() => next({ message: SERVER_ERROR_MESSAGE, status: STATUS_SERVER_ERROR }));
};

export const createCard = ( req: IUserRequest, res: Response, next: NextFunction) => {
  Card.create({ ...req.body, owner: req.user?._id })
    .then((result) => res.send(result))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next({ message: INVALID_DATA_MESSAGE, status: STATUS_BAD_REQUEST });
      } else {
        next({});
      };
    });
};

export const deleteCard = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  Card.findOneAndDelete(
    { _id: req.params.cardId, owner: req.user?._id },
    { runValidators: true, new: true }
  )
    .then((result) =>
      result
        ? res.send(result)
        : next({ message: CARDS_NOT_FOUND_MESSAGE })
    )
    .catch(() => next({}));
};

export const putCardLike = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { runValidators: true, new: true }
  )
    .then((result) =>
      result
        ? res.send(result)
        : next({ message: CARDS_NOT_FOUND_MESSAGE, status: STATUS_BAD_REQUEST })
    )
    .catch(() => next({}));
};

export const removeCardLike = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true }
  ).then((result) =>
    result
      ? res.send(result)
      : next({ message: CARDS_NOT_FOUND_MESSAGE, status: STATUS_NOT_FOUND })
  );
};