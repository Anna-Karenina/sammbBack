import express from 'express'
import bcrypt from "bcrypt";
import socket from "socket.io";
import { validationResult } from "express-validator";


import { UserModel } from "../models";
import { createJWTToken } from '../libz/'

class UserController{
  io: socket.Server;
  constructor(io: socket.Server){
    this.io = io;
  }


  getMe = (req: express.Request, res: express.Response) => {
    const id: string = req.user._id;
    UserModel.findById(id, (err, user)=>{
      if(err){
        return res.status(404).json({
          message: 'Вход не выполнен'
        })
      }
      res.json(user)
    })
  }

  create = (req: express.Request, res: express.Response) => {
    const postData = {
      email: req.body.email,
      name: req.body.newusername,
      password: req.body.signUpPasswordrepeat
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = new UserModel(postData);
    user
    .save()
    .then((obj: any) => {
      res.json(obj.confirm_hash);
    })
    .catch(reason => {
      res.status(500).json({
        status: 'error',
        statusMessage: reason,
        message: 'Такой пользователь уже зарегистрирован',
        variants: 'error'
      })
    });
  }


  login = (req: express.Request, res: express.Response) => {
    const postData = {
      email: req.body.email,
      password: req.body.password,

    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    UserModel.findOne({ email: postData.email }, (err, user: any) => {
     if (err || !user) {
       return res.json({
         status: 'error',
         message: 'Пользователь c таким логином не найден  ',
         variants: 'error'
       })
     }
      if (bcrypt.compareSync(postData.password, user.password)) {
        const token = createJWTToken(user)
        res.json({
          status: 'success',
          token,
          message: 'Авторизация выполнена'
        })
      } else {
        res.status(422).json({
          status: 'error',
          message: 'Не верный наверно пароль...',
          variants: 'error',
        });
      }
    });
  };
}

export default UserController
