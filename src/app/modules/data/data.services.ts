import { SortOrder } from 'mongoose'
import { IData, IDataFilters } from './data.interface'
import { Data } from './data.model'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { calculatePagination } from '../../../helpers/paginationHelper'
import { dataSearchableFields } from './data.constant'
import { ApiError } from '../../../errorFormating/apiError'
import httpStatus from 'http-status'
import { IVerifiedUser } from '../users/user.interface'

export const createDataService = async (
  payload: IData
): Promise<IData | null> => {
  const user = await Data.create(payload)
  if (!user) {
    throw new Error('Data create failed')
  }
  const result = await Data.findById(user._id).populate('seller')
  return result
}

export const getAllDatasService = async (
  paginationOptions: IPaginationOptions,
  filters: IDataFilters,
  user: IVerifiedUser
): Promise<IGenericResponse<IData[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions)
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters

  const andConditions = []

  // search on the filed
  if (searchTerm) {
    andConditions.push({
      $or: dataSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  // other filtering
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          $regex: value,
          $options: 'i',
        },
      })),
    })
  }

  // filter on price
  if (minPrice && maxPrice) {
    andConditions.push({
      price: {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      },
    })
  } else if (minPrice) {
    andConditions.push({
      price: {
        $gte: Number(minPrice),
      },
    })
  } else if (maxPrice) {
    andConditions.push({
      price: {
        $lte: Number(maxPrice),
      },
    })
  }

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const datas = await Data.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  let result = datas

  if (user.role === 'seller') {
    result = datas?.filter(data => {
      if (typeof data === 'object' && data !== null && 'seller' in data) {
        return data.seller._id.valueOf() === user._id
      }
      return false
    })
  }

  const total = await Data.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

export const getSingleDataService = async (
  id: string,
  user: IVerifiedUser
): Promise<IData | null> => {
  const data = await Data.findById(id).populate('seller')
  let result = data

  if (user.role === 'seller') {
    if (data?.seller._id.valueOf() === user._id) {
      result = data
    }

    if (data?.seller._id.valueOf() !== user._id) {
      result = null
      throw new Error('This is not your data')
    }
  }

  if (!result) {
    throw new Error('Data retrieved failed')
  }
  return result
}

export const updateDataService = async (
  id: string,
  payload: Partial<IData>,
  user: IVerifiedUser
): Promise<IData | null> => {
  const isExist = await Data.findById(id)
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found !')
  }

  let result = null

  if (isExist.seller._id.valueOf() === user._id) {
    result = await Data.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    }).populate('seller')
  }
  if (isExist.seller._id.valueOf() !== user._id) {
    throw new Error('This is not your data')
  }

  if (!result) {
    throw new Error('Data update failed')
  }
  return result
}

export const deleteDataService = async (
  id: string,
  user: IVerifiedUser
): Promise<IData | null> => {
  const isExist = await Data.findById(id)
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found !')
  }

  let result = null
  if (isExist.seller._id.valueOf() === user._id) {
    result = await Data.findByIdAndDelete(id).populate('seller')
  }
  if (isExist.seller._id.valueOf() !== user._id) {
    throw new Error('This is not your data')
  }

  if (!result) {
    throw new Error('Data delete failed')
  }
  return result
}
