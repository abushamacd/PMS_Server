import { z } from 'zod'

export const refreshTokenZod = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Zod: Refresh Token is required',
    }),
  }),
})
