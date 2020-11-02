import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  googleId:string
  firstName: string
  lastName: string
  email: string
  password: string
  admin: boolean
  banned: boolean
  transactions:object[]
}

const userSchema = new mongoose.Schema({
  
  googleId: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
 
  password: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Transaction"
    }
  ]
})

export default mongoose.model<UserDocument>('User', userSchema)
