import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL } from './constants'

const storage = new Storage()
const domainTimeMap = new Map<string, number>()
const domainLastCheckedMap = new Map<string, number>()

type DomainData = {
  id: number;
  domain: string;
  duration: number;
}

const getMonitoredDomains = async (): Promise<DomainData[]> => {
  const data = await storage.get(STORAGE_LABEL)

  if (!data) return []

  return Array.isArray(data) ? data : []
}

const extractDomain = ({
  url
}: {
  url: string
}): string => {
  try {
    const urlObj = new URL(url)

    return urlObj.hostname
  } catch {
    return ''
  }
}

const isTabActive = ({
  tab
}: {
  tab: chrome.tabs.Tab
}): boolean => {
  return tab.active || tab.audible
}

const getActiveDomainsFromTabs = ({
  tabs,
  monitoredDomains
}: {
  tabs: chrome.tabs.Tab[],
  monitoredDomains: DomainData[]
}): Set<string> => {
  const activeDomainsSet = new Set<string>()

  for (const tab of tabs) {
    if (!tab.url) continue

    const domain = extractDomain({
      url: tab.url
    })

    if (!domain) continue

    const domainConfig = monitoredDomains.find(d => d.domain === domain)

    if (!domainConfig) continue

    if (isTabActive({
      tab
    })) {
      activeDomainsSet.add(domain)
    }
  }

  return activeDomainsSet
}

const updateDomainTime = ({
  domain,
  domainConfig,
  now
}: {
  domain: string,
  domainConfig: DomainData,
  now: number
}): void => {
  const lastChecked = domainLastCheckedMap.get(domain) || now
  const timeElapsed = now - lastChecked
  const currentTotal = domainTimeMap.get(domain) || 0
  const newTotal = currentTotal + timeElapsed

  domainTimeMap.set(domain, newTotal)
  domainLastCheckedMap.set(domain, now)

  if (newTotal >= domainConfig.duration) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon.png',
      title: 'ClockLock',
      message: `Time limit reached for ${domain}`
    })
  }
}

const checkOpenTabs = async () => {
  const now = Date.now()
  const tabs = await chrome.tabs.query({})
  const monitoredDomains = await getMonitoredDomains()
  const activeDomainsSet = getActiveDomainsFromTabs({
    tabs,
    monitoredDomains
  })

  // Update time for active domains
  for (const domain of activeDomainsSet) {
    const domainConfig = monitoredDomains.find(d => d.domain === domain)
    if (domainConfig) {
      updateDomainTime({
        domain,
        domainConfig,
        now
      })
    }
  }

  // Reset last checked time for inactive domains
  for (const [domain, _] of domainLastCheckedMap) {
    if (!activeDomainsSet.has(domain)) {
      domainLastCheckedMap.set(domain, now)
    }
  }
}

chrome.tabs.onCreated.addListener(() => checkOpenTabs())
chrome.tabs.onUpdated.addListener(() => checkOpenTabs())
chrome.tabs.onRemoved.addListener(() => checkOpenTabs())

const setupMidnightReset = () => {
  const now = new Date()
  const midnight = new Date()

  midnight.setHours(24, 0, 0, 0)

  const timeUntilMidnight = midnight.getTime() - now.getTime()

  setTimeout(() => {
    domainTimeMap.clear()
    setupMidnightReset()
  }, timeUntilMidnight)
}

setupMidnightReset()

setInterval(() => checkOpenTabs(), 5000)
