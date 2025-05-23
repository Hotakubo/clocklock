import type { Data } from './types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL } from './constants'

const storage = new Storage()

const _isUpdateDate = ({ updatedDate }: { updatedDate: Data['updatedDate'] }) => {
  const today = new Date()
  const updateDay = new Date(updatedDate)

  today.setHours(0, 0, 0, 0)
  updateDay.setHours(0, 0, 0, 0)

  return updateDay <= today
}

const checkOpenTabs = async () => {
  const data: Data[] = await storage.get(STORAGE_LABEL)

  for (const v of data) {
  }
}

setInterval(() => checkOpenTabs(), 5000)
