import mongoose, { ConnectionOptions } from 'mongoose';


const URL:string = "mongodb+srv://karenina:yo19kWw2vDmDVcW0@clusterkoleso-nqmni.mongodb.net/"


const options:ConnectionOptions = {
  dbName: 'Koleso',
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  native_parser: true
}


mongoose.connect(URL, options)
.then(() => {
    console.log('Подключение к  Atlas Cluster удалось!')

  }).catch( (err: any) => console.error(err) )


