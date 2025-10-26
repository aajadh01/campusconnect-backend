// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode
  const message = err.message

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
}

module.exports = errorHandler
