import mongoose from 'mongoose';
import { AppError } from '../utils/appError.js';

export function requireObjectId(paramName = 'id') {
  return (req, _res, next) => {
    if (!mongoose.isValidObjectId(req.params[paramName])) {
      return next(new AppError(`Invalid ${paramName}.`, 400));
    }

    return next();
  };
}
