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
  const tabs = await chrome.tabs.query({})
  const openDomains = tabs.map(v => new URL(v.url).hostname)

  for (const v of data) {
    if (openDomains.includes(v.domain) && v.elapsed <= v.duration) {
      v.elapsed = v.elapsed + DELAY
    }

    if (_isUpdateDateBefore({ updatedDate: v.updatedDate })) {
      v.elapsed = 0
      v.updatedDate = new Date().getTime()
    }
  }
  logger.info(`Check\n${data.map(v => `domain: ${v.domain}\nelapsed: ${v.elapsed}\nduration: ${v.duration}`).join('\n\n')}`)

  await storage.set(STORAGE_LABEL, data)
}

setInterval(() => checkOpenTabs(), DELAY)
