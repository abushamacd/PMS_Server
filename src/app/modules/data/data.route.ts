import express from 'express'
import reqValidate from '../../../middleware/reqValidate'
import {
  createData,
  deleteData,
  getAllDatas,
  getSingleData,
  updateData,
} from './data.controller'
import { createDataZod, updateDataZod } from './data.validation'
import { auth } from '../../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
const router = express.Router()

router
  .route('/')
  .post(reqValidate(createDataZod), auth(ENUM_USER_ROLE.SELLER), createData)
  .get(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
    getAllDatas
  )

router
  .route('/:id')
  .get(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
    getSingleData
  )
  .patch(reqValidate(updateDataZod), auth(ENUM_USER_ROLE.SELLER), updateData)
  .delete(auth(ENUM_USER_ROLE.SELLER), deleteData)

export default router
