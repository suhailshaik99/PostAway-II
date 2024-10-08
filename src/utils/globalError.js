import AppError from "./AppError.js";

const handleDuplicateFields = (error) => {
  const value = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate Field value ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  let values = Object.values(err.errors).map((el) => el.message);
  let message = `${values.join(". ")}`;
  return new AppError(message, 400);
};

const sendError = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    errors: error.message,
  });
};

export const globalHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal Server Error";
  err.message = err.message || "Something went very wrong!";
  let error = { ...err };
  error.statusCode = err.statusCode;
  error.status = err.status;
  error.message = err.message;
  if (err.name === "ValidationError") error = handleValidationError(error);
  if (err.code === 11000) error = handleDuplicateFields(err);
    
  sendError(error, res);
};
