import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { DB, PORT } from "./utils/configurate";
import { errorLogger, requestLogger } from './middlewares/logger';
import { createUserValidator, loginValidator } from './utils/validator';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { ROUTER_NOT_FOUND_MESSAGE, STATUS_NOT_FOUND } from './utils/consts';
import CustomError from './errors/customError';
import errorHandler from './errors/errorHandler';

const app = express();

app.use(cookieParser());

mongoose.connect(DB);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.all('*', (req, res, next) => {
   next(new CustomError(STATUS_NOT_FOUND, ROUTER_NOT_FOUND_MESSAGE))
});


app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Приложение запушен на порте ${PORT}`);
});