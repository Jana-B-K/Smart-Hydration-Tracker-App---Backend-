
export const errorHandler = (err, req, res, next) => {

  // Simple error logging
  console.error('ERROR:', {
    message: err.message,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error'
  });
};