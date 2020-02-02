import express from 'express';
import { UserModel } from '../models';

declare module 'express' {
  export interface Request {
    user?: any;
  }
}

export default (
  req: express.Request,
  __: express.Response,
  next: express.NextFunction
) => {
  if (req.user) {
    UserModel.findByIdAndUpdate(
      { _id: req.user._id },
      { lastSeen: new Date() },
      { new: true },
      () => {}
    );
  }
  next();
};
