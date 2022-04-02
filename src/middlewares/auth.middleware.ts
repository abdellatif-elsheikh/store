import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import config from '../config';
import Error from '../interfaces/error.interface';

const handelUnAuthorizedError = (next: NextFunction) => {
  const error: Error = new Error('please login first');
  error.status = 401;
  next(error);
};

const validateToken = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // get auth header
    const authHeader = req.get('Authorization');
    if (authHeader) {
      const bearer = authHeader.split(' ')[0].toLowerCase();
      const token = authHeader.split(' ')[1];
      if (token && bearer === 'bearer') {
        const decode = Jwt.verify(token, config.token as string);
        if (decode) {
          next();
        } else {
          handelUnAuthorizedError(next);
        }
      } else {
        handelUnAuthorizedError(next);
      }
    } else {
      handelUnAuthorizedError(next);
    }
  } catch (e) {
    handelUnAuthorizedError(next);
  }
};

export default validateToken;
