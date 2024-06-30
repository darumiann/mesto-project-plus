import express from 'express';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { IUserRequest } from './types';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

// const mongoose1 = require("mongoose");

// const staticUserId = mongoose1.Types.ObjectId("6680756a0f975b7267ba0b9f");

app.use(( req: IUserRequest, res: Response, next: NextFunction ) => {
  req.user = { _id: "6680756a0f975b7267ba0b9f" };

  next();
});
app.use(express.json());

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log(`Приложени запушен на порте ${PORT}`);
});