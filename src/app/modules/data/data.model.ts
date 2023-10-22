import { categories, labels, locations } from './data.constant'
import { DataModel, IData } from './data.interface'
import { Schema, model } from 'mongoose'

const dataSchema = new Schema<IData, DataModel>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      enum: locations,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      enum: labels,
      required: true,
    },
    category: {
      type: String,
      enum: categories,
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)
export const Data = model<IData, DataModel>('Data', dataSchema)
