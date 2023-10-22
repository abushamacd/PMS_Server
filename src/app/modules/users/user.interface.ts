/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'
import { ENUM_USER_ROLE } from '../../../enums/user'

export type UserName = {
  firstName: string
  lastName: string
}

export type IUser = {
  name: UserName
  password: string
  role: 'seller' | 'buyer'
  phoneNumber: string
  passwordChangedAt?: Date
  address: string
  budget?: number
  income?: number
  _id: string
}

export type IVerifiedUser = {
  _id: string
  role: ENUM_USER_ROLE
  phoneNumber: string
  iat: number
  exp: number
}

export type UserModel = {
  isExist(
    phoneNumber: string
  ): Promise<Pick<IUser, 'phoneNumber' | 'password' | 'role' | '_id'>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IUser>

// export type UserModel = Model<IUser, Record<string, unknown>>
