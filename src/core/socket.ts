import socket from 'socket.io';
import http from 'http';
import NotificationsController from './../controllers/NotificationsController'


export default (http: http.Server) => {
  const io:SocketIO.Server = socket(http);
  let NC:any = new NotificationsController(io) 

  io.on('connection', (socket: any) => {
    console.log('a user connected');
    socket.on('NOTIFICATION:SEND', (notification: string) => {
      socket.notification = notification;
      socket.join(notification);
    })
    socket.on('CLIENT:READ_NOTIFICATIONS', (notice: any, fn:any) => {
      NC.updateReadedStatus(notice)
      fn('woot');
    });
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

  return io;
};
