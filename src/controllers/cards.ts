import { NextFunction, Request, Response } from "express";
import { IUserRequest } from "../types";
import Card from "../models/card";
import CustomError from "../errors/customError";
import { SERVER_ERROR_MESSAGE, STATUS_SERVER_ERROR, INVALID_DATA_MESSAGE, STATUS_BAD_REQUEST, CARDS_NOT_FOUND_MESSAGE, STATUS_NOT_FOUND, CARD_DELITION_SUCCESS_MESSAGE, STATUS_FORBIDDEN, STATUS_FORBIDDEN_MESSAGE, CARD_NOT_FOUND_MESSAGE, STATUS_SUCCESS} from "../utils/consts";

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(next);

export const createCard = ( req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const { _id } = req.user!;

  return Card.create({ name, link, owner: _id })
    .then((card) => {
      res.status(STATUS_SUCCESS).send({ data: card });
    })
    .catch((err: Error) => {
      if (err.name === 'ValidationError') {
        next(new CustomError(STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE));
      }
      next(err);
    });
};

export const deleteCard = ( req: IUserRequest, res: Response, next: NextFunction ) => {
  const { _id } = req.user!;
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (JSON.stringify(card.owner) === JSON.stringify(_id)) {
        card.deleteOne()
          .then(() => {
            res.status(STATUS_SUCCESS).send({ message: CARD_DELITION_SUCCESS_MESSAGE });
          });
      } else {
        next(new CustomError(STATUS_FORBIDDEN, STATUS_FORBIDDEN_MESSAGE ));
      }
    })
    .catch((err: Error) => {
      if (err.name === 'CastError') {
        next(new CustomError(STATUS_NOT_FOUND, CARDS_NOT_FOUND_MESSAGE));
      }
      next(err);
    });
};

export const putCardLike = ( req: IUserRequest, res: Response, next: NextFunction ) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user!._id } },
    { new: true }
  )
  .orFail()
  .populate('owner')
  .populate('likes')
  .then((card) => res.status(STATUS_SUCCESS).send({ data: card }))
  .catch((err: Error) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new CustomError(STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE));
    } else if (err.name === 'DocumentNotFoundError') {
      next(new CustomError(STATUS_BAD_REQUEST, CARDS_NOT_FOUND_MESSAGE));
    }
    next(err);
  });

export const removeCardLike = ( req: IUserRequest, res: Response, next: NextFunction ) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true }
  )
  .orFail()
  .populate('owner')
  .populate('likes')
  .then((card) => res.status(STATUS_SUCCESS).send({ data: card }))
  .catch((err: Error) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new CustomError(STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE));
    } else if (err.name === 'DocumentNotFoundError') {
      next(new CustomError(STATUS_BAD_REQUEST, CARDS_NOT_FOUND_MESSAGE))
    }
  });