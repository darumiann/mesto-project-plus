import express from 'express';
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
import { STATUS_SERVER_ERROR, SERVER_ERROR_MESSAGE } from './utils/consts';

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

// app.all('*', () => {
//   throw({ message: STATUS_SERVER_ERROR , status: SERVER_ERROR_MESSAGE })
// })

app.use(errors());
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Приложени запушен на порте ${PORT}`);
});