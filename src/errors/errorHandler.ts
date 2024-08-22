import { Request, Response, NextFunction } from 'express';
import CustomError from './customError';
import { STATUS_SERVER_ERROR, SERVER_ERROR_MESSAGE } from '../utils/consts';

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send(
    { message: statusCode === STATUS_SERVER_ERROR ? SERVER_ERROR_MESSAGE : message },
  );
  next();
};

export default errorHandler;