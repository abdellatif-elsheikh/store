import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';

const userModel = new UserModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userModel.create(req.body);
    res.json({
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
    res.json({
      data: { ...result },
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
    console.log(user);

    res.json({
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
    res.json({
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
    res.json({
      status: 200,
      message1: 'user deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
