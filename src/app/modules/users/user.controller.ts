import { Request, Response } from 'express'
import {
  deleteUserService,
  getAllUsersService,
  getSingleUserService,
  getSpecificUserService,
  updateSpecificUserService,
  updateUserService,
} from './user.services'
import { sendRes } from '../../../utilities/sendRes'
import { tryCatch } from '../../../utilities/tryCatch'
import { IUser, IVerifiedUser } from './user.interface'
import httpStatus from 'http-status'

export const getAllUsers = tryCatch(async (req: Request, res: Response) => {
  const result = await getAllUsersService()
  sendRes<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  })
})

export const getSingleUser = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await getSingleUserService(id)
  sendRes<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
})

export const updateUser = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const updatedData = req.body
  const result = await updateUserService(id, updatedData)
  sendRes<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User update successfully',
    data: result,
  })
})

export const deleteUser = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await deleteUserService(id)
  sendRes<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User delete successfully',
    data: result,
  })
})

export const getSpecificUser = tryCatch(async (req: Request, res: Response) => {
  const result = await getSpecificUserService(req.user as IVerifiedUser)
  sendRes<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
})

export const updateSpecificUser = tryCatch(
  async (req: Request, res: Response) => {
    const updatedData = req.body
    const result = await updateSpecificUserService(
      req.user as IVerifiedUser,
      updatedData
    )
    sendRes<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User update successfully',
      data: result,
    })
  }
)
