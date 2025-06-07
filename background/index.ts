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

const _isDomainMatch = ({
  domains,
  domain,
  isSubdomainIncluded
}: {
  domains: Data['domain'][],
  domain: Data['domain'],
  isSubdomainIncluded: Data['isSubdomainIncluded']
}) => {
  if (isSubdomainIncluded) {
    return domains.some(d => domain.endsWith(d))
  }
  return domains.includes(domain)
}

const checkOpenTabs = async () => {
  const data: Data[] = await storage.get(STORAGE_LABEL)
  const tabs = await chrome.tabs.query({})
  const openDomains = tabs.map(v => new URL(v.url).hostname)

  for (const v of data) {
    const isDomainMatch = _isDomainMatch({
      domains: openDomains,
      domain: v.domain,
      isSubdomainIncluded: v.isSubdomainIncluded
    })

    if (isDomainMatch && v.elapsed <= v.duration) {
      v.elapsed = v.elapsed + DELAY
    }

    if (_isUpdateDateBefore({ updatedDate: v.updatedDate })) {
      v.elapsed = 0
      v.updatedDate = new Date().getTime()
    }
  }
  logger.info(`Check\n${data.map(v => `domain: ${v.domain}\nduration: ${v.duration}\nelapsed: ${v.elapsed}`).join('\n\n')}`)

  await storage.set(STORAGE_LABEL, data)
}

setInterval(() => checkOpenTabs(), DELAY)
