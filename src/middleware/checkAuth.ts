import  express from 'express'
import { verifyJWTToken } from "../libz";



export default (req: any, res: express.Response, next: express.NextFunction) => {
  if (req.path === "/auth/signin" ||
      req.path === "/auth/signup" ||
      req.path === '/notice/getall') {
    return next();
  }

  const token = req.headers.token;

  verifyJWTToken(token)
    .then((user: any) => {
      req.user = user.data._doc;
      next();
    })
    .catch(_err => {
      res.status(403).json({ message: "token problem." });
    });
};
