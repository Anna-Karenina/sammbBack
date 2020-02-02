import jwt from 'jsonwebtoken'
import {reduce} from 'lodash'

interface ILoginData{
  username: string
  password: string
}

export default (user: ILoginData) => {
let token:string = jwt.sign(
    {
      data: reduce(
        user, (
          result : any, value: string, key: string) => {
        if (key !== 'password'){
          result[key] = value
        }
        return result
      }, {})
    },
    process.env.JWT_KEY || '' ,
      {
        expiresIn: process.env.JWT_AGE,
        algorithm:'HS256'
      },
  )
  return token
}