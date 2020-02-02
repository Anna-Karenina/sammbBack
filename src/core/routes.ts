import bodyParser from 'body-parser'
import express from 'express'
import socket from 'socket.io'
import { updateLastSeen, checkAuth } from "../middleware";
import { loginValidation } from "../libz/validations";

import { UserCtr, NoticeCtr } from "../controllers";


const  createRoutes = async (
  app: express.Application,
  io: socket.Server ) => {
    const UserController = new UserCtr(io)
    const NotificationsController = new NoticeCtr(io);


    app.use(bodyParser.json())
    app.use(checkAuth)
    app.use(updateLastSeen)

    app.get('/auth/me', UserController.getMe)
    app.post('/auth/signin', loginValidation, UserController.login)
    app.post('/auth/signup', UserController.create)

    app.get('/notice/getall', NotificationsController.getall)
    app.get('/notice/getsorted', NotificationsController.getsorted)
    app.put('/notice/create', NotificationsController.create)
    app.post('/notice/sethidecategory', NotificationsController.addHideCategory)
    
}
export default createRoutes
