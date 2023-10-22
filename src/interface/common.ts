import { IErrorMessage } from './error'

export type IErrorResponse = {
  statusCode: number
  message: string
  errorMessage: IErrorMessage[]
}

export type IGenericResponse<T> = {
  meta: {
    page: number
    limit: number
    total: number
  }
  data: T
}

export type IAuthLogin = {
  phoneNumber: string
  password: string
}

export type IAuthLoginResponse = {
  accessToken: string
  refreshToken?: string
}

export type IRefreshTokenResponse = {
  accessToken: string
}
