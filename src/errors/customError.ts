import { STATUS_SERVER_ERROR, SERVER_ERROR_MESSAGE } from "../utils/consts";

class CustomError extends Error {
  statusCode;

  constructor( statusCode = STATUS_SERVER_ERROR, message = SERVER_ERROR_MESSAGE ) {
    super(message);
    this.statusCode = statusCode;
  }
};

export default CustomError;