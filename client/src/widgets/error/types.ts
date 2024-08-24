import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export type ErrorComponentProps = {
  error: FetchBaseQueryError | SerializedError
}
