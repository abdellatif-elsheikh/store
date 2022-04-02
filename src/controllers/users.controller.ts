import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../models/user.model';

const userModel = new UserModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.create(req.body);
    return res.json({
      data: { ...user },
      status: 200,
      message: 'user created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMany = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userModel.getMany();
    return res.json({
      data: [...result],
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const user = await userModel.getOne(userId as string);

    return res.json({
      data: { ...user },
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.update(req.body);
    return res.json({
      status: 200,
      message: 'user info has ben updated',
      data: { ...user },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await userModel.delete(id as string);
    return res.json({
      status: 200,
      message: 'user deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.authenticate(req.body);
    const token = jwt.sign({ user }, config.token as string);
    if (user) {
      return res.json({
        status: 200,
        message: 'logged in successfully',
        data: { ...user, token },
      });
    }
    return res.status(401).json({
      status: 401,
      message: 'your email or password is incorrect',
    });
  } catch (error) {
    next(error);
  }
};
