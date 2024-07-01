import { Router } from 'express';
import { getCards, createCard, deleteCard, putCardLike, removeCardLike } from '../controllers/cards';
import { createCardValidator, cardIdValidator } from '../utils/validator';

const router = Router();

router.get("/", getCards);
router.post("/", createCardValidator, createCard);
router.delete("/:cardId", cardIdValidator, deleteCard);
router.put("/:cardId/likes", cardIdValidator, putCardLike);
router.delete("/:cardId/likes", cardIdValidator ,removeCardLike);

export default router;