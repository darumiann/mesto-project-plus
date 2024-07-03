import { Router } from "express";
import { getUser, getUsers, getUserById, updateUser, updateUserAvatar } from '../controllers/users';
import { userIdValidator, updateUserInfoValidator, updateAvatarValidator } from '../utils/validator';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.get('/:userId', userIdValidator, getUserById);
usersRouter.patch('/me', updateUserInfoValidator, updateUser);
usersRouter.patch('/me/avatar', updateAvatarValidator, updateUserAvatar);

export default usersRouter;