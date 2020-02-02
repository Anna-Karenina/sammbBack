import express, { Application }  from   'express'
import dotenv from 'dotenv'
import { createServer, Server } from "http"
import mongoose from 'mongoose'
import cors from 'cors' 
import "./core/connectdb";
mongoose.Promise = global.Promise

import createRoutes from './core/routes'
import createSockets from './core/socket'

const app: Application = express()
const http: Server = createServer(app)
dotenv.config()
app.use(cors())

http.listen(process.env.PORT,  () => {
  console.log(`Приложение стартовало : http://localhost:${process.env.PORT}`)
});

mongoose.connection.on('open', () => {
  const io = createSockets(http)
  createRoutes(app, io)
})
mongoose.connection.on('close', function () {
    console.log(new Date() + ' @ MongoDB: Connection Closed');
    console.log('Манго упал !! ');
});
