import type { Data } from '~/shared/types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL, DELAY } from '~/shared/constants'
import { isDomainMatch, tabsToDomains } from '~/shared/elapsed'

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
  const domains = await tabsToDomains()

  for (const v of data) {
    const isMatch = isDomainMatch({
      domains: domains,
      domain: v.domain,
      isSubdomainIncluded: v.isSubdomainIncluded
    })

    if (isMatch && v.elapsed <= v.duration) {
      v.elapsed = v.elapsed + DELAY
    }

    if (_isUpdateDateBefore({ updatedDate: v.updatedDate })) {
      v.elapsed = 0
      v.updatedDate = new Date().getTime()
    }
  }

  await storage.set(STORAGE_LABEL, data)
}

setInterval(() => checkOpenTabs(), DELAY)
