import { Suspense } from 'react'
import { Routing } from '@/pages'
import '@fontsource/montserrat'
import './index.scss'

export function App() {
  return (
    <Suspense fallback={'Loading...'}>
      <Routing />
    </Suspense>
  )
}
