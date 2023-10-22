import { z } from 'zod'
import { categories, labels, locations } from './data.constant'

export const createDataZod = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Zod: Name is required',
    }),
    age: z.number({
      required_error: 'Zod: Age is required',
    }),
    price: z.number({
      required_error: 'Zod: Price is required',
    }),
    location: z.enum([...locations] as [string, ...string[]], {
      required_error: 'Zod: Location is required',
    }),
    breed: z.string({
      required_error: 'Zod: Breed is required',
    }),
    weight: z.number({
      required_error: 'Zod: Weight is required',
    }),
    label: z.enum([...labels] as [string, ...string[]], {
      required_error: 'Zod: Label is required',
    }),
    category: z.enum([...categories] as [string, ...string[]], {
      required_error: 'Zod: Category is required',
    }),
    seller: z.string({
      required_error: 'Zod: Seller is required',
    }),
  }),
})

export const updateDataZod = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    price: z.number().optional(),
    location: z.enum([...locations] as [string, ...string[]]).optional(),
    breed: z.string().optional(),
    weight: z.number().optional(),
    label: z.enum([...labels] as [string, ...string[]]).optional(),
    category: z.enum([...categories] as [string, ...string[]]).optional(),
    seller: z.string().optional(),
  }),
})
