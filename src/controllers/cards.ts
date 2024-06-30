import { NextFunction, Request, Response } from "express";
import { IUserRequest } from "../types";
import Card from "../models/card";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((result) => (result.length ? res.send(result) : next({})))
    .catch(() => next({ message: "Ощибка на стороне сервера", status: 500 }));
};

export const createCard = ( req: IUserRequest, res: Response, next: NextFunction) => {
  Card.create({ ...req.body, owner: req.user?._id })
    .then((result) => res.send(result))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next({ message: "Переданы некорректные данные при создании карточки", status: 400 });
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
        : next({ message: "Карточка с указанным идентификатором не найдена" })
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
        : next({ message: "Передан несуществующий идентификатор карточки.", status: 400 })
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
      : next({ message: "Карточка с указанным индетификатором не найдена", status: 404 })
  );
};