import type { Data } from '~/shared/types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL, DELAY } from '~/shared/constants'
import { logger } from '~/shared/logger'

const storage = new Storage()

const _isUpdateDateBefore = ({ updatedDate }: { updatedDate: Data['updatedDate'] }) => {
  const today = new Date()
  const updateDay = new Date(updatedDate)

  today.setHours(0, 0, 0, 0)
  updateDay.setHours(0, 0, 0, 0)

  return updateDay < today
}

const checkOpenTabs = async () => {
  const data: Data[] = await storage.get(STORAGE_LABEL)

  for (const v of data) {
    if (v.elapsed <= v.duration) {
      v.elapsed = v.elapsed + DELAY
    }

    if (_isUpdateDateBefore({ updatedDate: v.updatedDate })) {
      v.elapsed = 0
      v.updatedDate = new Date().getTime()
    }
  }
  data.map(v => logger.info(`domain: ${v.domain}, elapsed: ${v.elapsed}, duration: ${v.duration}`))

  await storage.set(STORAGE_LABEL, data)
}

setInterval(() => checkOpenTabs(), DELAY)
