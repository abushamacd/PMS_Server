import { Model, Types } from 'mongoose'
import { IUser } from '../users/user.interface'

export type IData = {
  name: string
  age: number
  price: number
  location:
    | 'Dhaka'
    | 'Chattogram'
    | 'Barishal'
    | 'Rajshahi'
    | 'Sylhet'
    | 'Comilla'
    | 'Rangpur'
    | 'Mymensingh'
  breed: string
  weight: number
  label: 'for sale' | 'sold out'
  category: 'Dairy' | 'Beef' | 'DualPurpose'
  seller: Types.ObjectId | IUser
}

export type DataModel = Model<IData, Record<string, unknown>>

export type IDataFilters = {
  searchTerm?: string
  minPrice?: string
  maxPrice?: string
  location?: string
}
