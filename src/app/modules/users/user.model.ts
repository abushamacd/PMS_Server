import { Schema, model } from 'mongoose'
import { IUser, UserModel } from './user.interface'
import { role } from './user.constant'
import bcrypt from 'bcrypt'
import config from '../../../config'

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
    },
    role: {
      type: String,
      enum: role,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    passwordChangedAt: {
      type: Date,
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
    },
    income: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

userSchema.pre('save', function (next) {
  if (this.role == 'seller') {
    this.budget = 0
    this.income = 0
  } else if (this.role == 'buyer') {
    this.income = 0
  }
  next()
})

// Existency Check
userSchema.statics.isExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, 'phoneNumber' | 'password' | 'role' | '_id'> | null> {
  return await User.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1 }
  )
}

// Password Match
userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

// Password Encrypt
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_solt_round)
  )
  next()
})

export const User = model<IUser, UserModel>('User', userSchema)
