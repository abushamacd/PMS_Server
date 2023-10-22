import { Request, Response } from 'express'
import { sendRes } from '../../../utilities/sendRes'
import { tryCatch } from '../../../utilities/tryCatch'
import {
  createDataService,
  deleteDataService,
  getAllDatasService,
  getSingleDataService,
  updateDataService,
} from './data.services'
import httpStatus from 'http-status'
import { IData } from './data.interface'
import { pick } from '../../../utilities/pick'
import { dataFilterableFields } from './data.constant'
import { paginationFields } from '../../../constants/pagination'
import { IVerifiedUser } from '../users/user.interface'

export const createData = tryCatch(async (req: Request, res: Response) => {
  const result = await createDataService(req.body)
  sendRes<IData>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data created successfully',
    data: result,
  })
})

export const getAllDatas = tryCatch(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const filters = pick(req.query, dataFilterableFields)

  const result = await getAllDatasService(
    paginationOptions,
    filters,
    req.user as IVerifiedUser
  )

  sendRes<IData[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Datas retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

export const getSingleData = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await getSingleDataService(id, req.user as IVerifiedUser)
  sendRes<IData>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data retrieved successfully',
    data: result,
  })
})

export const updateData = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const updatedData = req.body
  const result = await updateDataService(
    id,
    updatedData,
    req.user as IVerifiedUser
  )
  sendRes<IData>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data update successfully',
    data: result,
  })
})

export const deleteData = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await deleteDataService(id, req.user as IVerifiedUser)
  sendRes<IData>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data delete successfully',
    data: result,
  })
})
