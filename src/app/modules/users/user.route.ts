import express from 'express'
const router = express.Router()
import reqValidate from '../../../middleware/reqValidate'
import { updateUserZod } from './user.validation'
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  getSpecificUser,
  updateSpecificUser,
  updateUser,
} from './user.controller'
import { auth } from '../../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

router.route('/').get(auth(ENUM_USER_ROLE.ADMIN), getAllUsers)

router
  .route('/my-profile')
  .get(auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER), getSpecificUser)
  .patch(
    reqValidate(updateUserZod),
    auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
    updateSpecificUser
  )

router
  .route('/:id')
  .get(auth(ENUM_USER_ROLE.ADMIN), getSingleUser)
  .patch(reqValidate(updateUserZod), auth(ENUM_USER_ROLE.ADMIN), updateUser)
  .delete(auth(ENUM_USER_ROLE.ADMIN), deleteUser)

export default router
