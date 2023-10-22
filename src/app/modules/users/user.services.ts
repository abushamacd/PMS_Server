/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status'
import { ApiError } from '../../../errorFormating/apiError'
import { IUser, IVerifiedUser } from './user.interface'
import { User } from './user.model'
import config from '../../../config'
import bcrypt from 'bcrypt'

export const getAllUsersService = async (): Promise<IUser[] | null> => {
  const result = await User.find()
  if (!result) {
    throw new Error('Users retrieved failed')
  }
  return result
}

export const getSingleUserService = async (
  id: string
): Promise<IUser | null> => {
  const result = await User.findById(id)
  if (!result) {
    throw new Error('User not found !')
  }
  return result
}

export const updateUserService = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findById(id)

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }
  const { name, ...userData } = payload
  const updatedUserData: Partial<IUser> = { ...userData }

  // dynamicallly handel name
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const dataKey = `name.${key}` as keyof Partial<IUser>
      ;(updatedUserData as any)[dataKey] = name[key as keyof typeof name]
    })
  }
  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  })
  if (!result) {
    throw new Error('User update failed')
  }
  return result
}

export const deleteUserService = async (id: string): Promise<IUser | null> => {
  const isExist = await User.findById(id)
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }
  const result = await User.findByIdAndDelete(id)
  if (!result) {
    throw new Error('User delete failed')
  }
  return result
}

export const getSpecificUserService = async (
  user: IVerifiedUser
): Promise<IUser | null> => {
  const result = await User.findById(user._id)

  if (!result) {
    throw new Error('User not found !')
  }
  return result
}

export const updateSpecificUserService = async (
  user: IVerifiedUser,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const { _id } = user

  const isExist = await User.findById(_id)
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }
  const { name, role, password, ...userData } = payload
  const updatedUserData: Partial<IUser> = { ...userData }

  if (password) {
    const dataKey = `password` as keyof Partial<IUser>
    ;(updatedUserData as any)[dataKey] = await bcrypt.hash(
      password,
      Number(config.bcrypt_solt_round)
    )
  }

  if (isExist.role === 'buyer') {
    if (role) {
      const dataKey = `role` as keyof Partial<IUser>
      ;(updatedUserData as any)[dataKey] = 'buyer'
    }
  } else if (isExist.role === 'seller') {
    if (role) {
      const dataKey = `role` as keyof Partial<IUser>
      ;(updatedUserData as any)[dataKey] = 'seller'
    }
  }

  // dynamicallly handel name
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const dataKey = `name.${key}` as keyof Partial<IUser>
      ;(updatedUserData as any)[dataKey] = name[key as keyof typeof name]
    })
  }

  const result = await User.findOneAndUpdate({ _id }, updatedUserData, {
    new: true,
  })

  if (!result) {
    throw new Error('User update failed')
  }
  return result
}
