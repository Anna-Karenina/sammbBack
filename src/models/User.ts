import mongoose , {Schema, Document} from 'mongoose'
import { isEmail } from 'validator'
import differenceInMinutes from "date-fns/differenceInMinutes"
import { generatePasswordHash } from "../libz/";

export interface IUser extends Document {
  name: string;
  email?: string;
  password: string;
  lastSeen: Date;
  hierarchy: number;
  hidencategory?: string[]
}

const UserSchema = new Schema (
  {
    name: {
      type: String,
      require: true,
      required: 'Обязателен для ввода',
    },
    email: {
      type: String,
      require: true,
      required: 'Обязателен для ввода',
      validate: [isEmail, 'Формат почты указан не верно'],
      unique: true,
    },
    password: {
      type:String,
      required: 'Обязателен для ввода',
    },
    lastSeen: {
      type:Date,
      default: new Date()
    },
    hierarchy:{
      type: Number,
      default: 1
    },
    hidencategory:{
      type:Array
    } 
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual('isOnline').get(function(this: any) {
  return differenceInMinutes(new Date(), this.lastSeen) < 5;
});

UserSchema.set('toJSON', {
  virtuals: true
});

UserSchema.pre('save', async function(this: IUser, next: () => void) {
  const user: any = this

  if (!user.isModified('password')) {
    return next();
  }
    user.password = await generatePasswordHash(user.password);
  });

const UserModel = mongoose.model<IUser>('User' , UserSchema )

export default  UserModel
