import { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import errorMiddleware from './error.middleware';

// add middleware to parse incoming requests
// security

// add http request logger middleware
const morganExport = morgan('common');
// http security middleware
const helmetExport = helmet();
// error handler middleware
// create limit for api requests
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'to many requests please try agin after two mints',
});

const error_404 = (_req: Request, res: Response): void => {
  res.status(404).json({
    message: 'you are lost you can go back to Home http://localhost:5000/',
  });
};

export default {
  morganExport,
  helmetExport,
  limiter,
  errorMiddleware,
  error_404,
};
