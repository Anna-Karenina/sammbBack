import express from 'express'
import socket from "socket.io";


import { NotificationsModel, UserModel } from "../models";
import { INotifications } from '../models/Notifications';

class NotificationsController{
  io: socket.Server;
  constructor(io: socket.Server){
    this.io = io;
  }

  create = (req: express.Request, res: express.Response) => {
    const userId: string = req.user._id;
    const postData = {
      creator: userId,
      title: req.body.title,
      discription: req.body.discription,
      category: req.body.category
    };
    const notice = new NotificationsModel(postData);
    notice
    .save()
    .then((doc: any) => {
      doc.populate(["creator"],(err: any, Notification: INotifications) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: err
          });
        }
        res.json(Notification);
        this.io.emit("SERVER:NEW_NOTICE", Notification);
      })
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
  
  getall = (_req: express.Request, res: express.Response) => {
    NotificationsModel.find()
      .populate("creator")
        .exec((err, notis)=>{
          if (err) {
            return res.status(404).json({
              message: "Messages not found"
            });
          } 
          return res.json(notis);
        });
  }

  getsorted = async (req: express.Request, res: express.Response) => {
    //not readed & hidden category notification
    const userId: string = await req.query.userId;
    const user = await UserModel.findById(userId)
    const query = await NotificationsModel.find().populate("creator")
     const sorted:any  =  query.filter(i=>{
       if(user!.hidencategory?.includes(i.category)){
        return false
       }else if(i.readed.includes(userId)){
         return false
       }else return i
     })
     return res.json(sorted);
  }

  addHideCategory =(req: express.Request, res: express.Response) =>{
    const userId: string = req.user._id;
    const noticeId: string = req.body.id
    NotificationsModel.findById(noticeId , (err:any ,notice:any)=>{
      if(err){
        return res.status(404).json({
          message: 'notice not find'})
      }else{
        UserModel.findByIdAndUpdate(userId ,
          { $push: { "hidencategory": notice.category } }
          , {upsert: true, new:true})
        .then(()=>res.status(200).json({message:'all ok!'}))
        .catch((err)=>res.status(404).json({
          message: "Messages not found"
        }))
      }
    })
  }

  updateReadedStatus = async (notifications:any, next:express.NextFunction) => {
    const noticeID = notifications.noticeID
    const userId =  notifications.usersId
    NotificationsModel.findById(noticeID , (err, notice)=>{
      if (err) {return next(err);}
      if (notice){
        if (notice.readed.includes(userId)){
          console.log('exist, im goin next!')
        } else {
          notice.readed.push(userId);
         }
      notice.save(function(err){
        if (err) {return next(err)}
      })
    }
  });
  }

}

export default NotificationsController
