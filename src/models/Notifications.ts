import mongoose, { Schema, Document } from 'mongoose';

export interface INotifications extends Document {
  _id:Schema.Types.ObjectId;
  createdAt: Date;
  creator: {
    type: Schema.Types.ObjectId;
    ref: string;
    require: true;
  };
  title: {
    type: string;
    require: boolean;
  };
  discription: {
    type: string;
    require: boolean;
  };
  category: string;
  
  readed: Array<string> ;

}



const NotificationsSchema = new Schema(
  {
    title: { type: String, require: true },
    discription: { type: String, require: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    category:{type: String, require: false,},
    readed: {type: Array },
  },
  {
    timestamps: true,
    usePushEach: true,
  },
);

const NotificationsModel = mongoose.model<INotifications>('Notice', NotificationsSchema);

export default NotificationsModel;
