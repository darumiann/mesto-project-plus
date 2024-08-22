import { Router } from 'express';
import { getCards, createCard, deleteCard, putCardLike, removeCardLike } from '../controllers/cards';
import { createCardValidator, cardIdValidator } from '../utils/validator';

const cardsRouter = Router();

cardsRouter.get("/", getCards);
cardsRouter.post("/", createCardValidator, createCard);
cardsRouter.delete("/:cardId", cardIdValidator, deleteCard);
cardsRouter.put("/:cardId/likes", cardIdValidator, putCardLike);
cardsRouter.delete("/:cardId/likes", cardIdValidator ,removeCardLike);

export default cardsRouter;