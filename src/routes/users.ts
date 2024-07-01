import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, updateUserAvatar, login } from '../controllers/users';
import { createCardValidator, cardIdValidator, createUserValidator, loginValidator, userIdValidator, updateUserInfoValidator, updateAvatarValidator } from '../utils/validator';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', userIdValidator, getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfoValidator, updateUser);
router.patch('/me/avatar', updateAvatarValidator, updateUserAvatar);

export default router;