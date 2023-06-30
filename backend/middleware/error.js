const ErrorHander = require("../utils/error-handler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 200;
  err.message = err.message || "Internal Server Error";

  //wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHander(message, 200);
  }

  // mongoose error
  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)} entered`;
    err = new ErrorHander(message, 200);
  }

  // jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token invalid, Try again`;
    err = new ErrorHander(message, 200);
  }

  // jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = "Json web token expired,Try later";
    err = new ErrorHander(message, 200);
  }
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
