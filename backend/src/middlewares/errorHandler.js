export function errorHandler(err, _req, res, _next) {
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'An account with that email already exists.',
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message || 'Internal server error.',
    ...(err.details ? { details: err.details } : {}),
  });
}
