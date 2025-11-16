import bcrypt from 'bcryptjs'
import { User } from '@/database/models/user.model.js'
import { env } from '@/config/index.js'

export async function seedSuperadmin() {
  const username = env.ADMIN_USERNAME
  const password = env.ADMIN_PASSWORD

  if (!username || !password) return

  const existing = await User.findOne({ username })
  if (existing) return

  const passwordHash = await bcrypt.hash(password, 10)
  await User.create({
    username,
    passwordHash,
    role: 'superadmin',
    isApproved: true,
    isActive: true,
  })

  console.log('Superadmin seeded:', username)
}
