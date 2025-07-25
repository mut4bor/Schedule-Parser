import { Request, Response } from 'express'
import { downloadSchedules } from '@/database/scripts/downloadSchedules.js'
import { updateGroups } from '@/database/scripts/updateGroups.js'
import { REFRESH_PASSWORD } from '@/config/index.js'

const refreshSchedule = async (req: Request, res: Response) => {
  try {
    if (req.body.password === REFRESH_PASSWORD) {
      await downloadSchedules()
      await updateGroups()
      res.status(200).json({ message: 'Database updated successfully' })
      return
    }
    res.status(401).json({ message: 'Incorrect password' })
  } catch (error) {
    console.error('Error occurred:', error)
    res.status(500).json({ message: 'Error updating database' })
  }
}

export { refreshSchedule }
