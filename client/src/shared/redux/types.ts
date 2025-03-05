export interface IRefreshSchedule {
  message: string
}

export interface IName {
  group: string
  _id: string
  index: number
}

export interface IGroup extends IName {
  educationType: string
  faculty: string
  course: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IFaculties {
  [educationType: string]: string[]
}

export interface ISchedule {
  [week: string]: {
    [day: string]: {
      [time: string]: string
    }
  }
}

export type StatusType = 'owner' | 'admin' | 'user'

export interface ApiRegisterRequest {
  phone_number: string
  password: string
}

export interface ApiRegisterResponse {
  success: boolean
  message: string
  phone_number: string
}

export interface ApiLoginRequest {
  phone_number: string
  password: string
}

export interface ApiLoginResponse {
  success: boolean
  message: string
}

export interface ApiLogoutResponse {
  success: boolean
  message: string
}

export interface ApiGetProfileInfoSuccessResponse {
  success: true
  phone_number: string
  first_name: string
  last_name: string
  email: string
  status: StatusType
}

export interface ApiGetProfileInfoErrorResponse {
  success: false
  message: string
}

export type ApiGetProfileInfoResponse =
  | ApiGetProfileInfoSuccessResponse
  | ApiGetProfileInfoErrorResponse

export interface ApiChangeProfileInfoRequest {
  first_name: string
  last_name: string
  email: string
  phone_number: string
}

export interface ApiChangeProfileInfoResponse {
  success: boolean
  message: string
}
