import { seedSuperadmin } from '@/database/bootstrap/seedSuperadmin.js'
import '@/config/index.js'
import mongoose from 'mongoose'
import { env } from '@/config/index.js'

async function main() {
  await mongoose.connect(env.MONGODB_URL)
  await seedSuperadmin()
  await mongoose.disconnect()
}

main()
