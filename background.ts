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

// Get domains from storage
async function getMonitoredDomains(): Promise<DomainData[]> {
  const data = await storage.get(STORAGE_LABEL)

  if (!data) return []

  return Array.isArray(data) ? data : []
}

// Extract domain from URL
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ''
  }
}

// Check all open tabs
async function checkOpenTabs() {
  const monitoredDomains = await getMonitoredDomains()
  const tabs = await chrome.tabs.query({})

  const now = Date.now()
  const midnight = new Date()
  midnight.setHours(0, 0, 0, 0)
  const timeSinceMidnight = now - midnight.getTime()

  // Track domains that are currently open or playing audio
  const activeDomainsSet = new Set<string>()

  // First pass: collect all active domains
  for (const tab of tabs) {
    if (tab.url) {
      const domain = extractDomain(tab.url)
      if (domain) {
        // Check if this domain is monitored
        const domainConfig = monitoredDomains.find(d => d.domain === domain)
        if (domainConfig) {
          // Consider domain active if tab is visible or playing audio
          if (tab.active || tab.audible) {
            activeDomainsSet.add(domain)
          }
        }
      }
    }
  }

  // Second pass: update time for active domains
  for (const domain of activeDomainsSet) {
    const domainConfig = monitoredDomains.find(d => d.domain === domain)
    if (domainConfig) {
      // Update time tracking
      const lastChecked = domainLastCheckedMap.get(domain) || now
      const timeElapsed = now - lastChecked
      const currentTotal = domainTimeMap.get(domain) || 0
      const newTotal = currentTotal + timeElapsed

      domainTimeMap.set(domain, newTotal)
      domainLastCheckedMap.set(domain, now)

      // Check if duration exceeded
      if (newTotal >= domainConfig.duration) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icon.png',
          title: 'ClockLock',
          message: `Time limit reached for ${domain}`
        })
      }
    }
  }

  // Reset last checked time for domains that are no longer active
  for (const [domain, _] of domainLastCheckedMap) {
    if (!activeDomainsSet.has(domain)) {
      domainLastCheckedMap.set(domain, now)
    }
  }
}

function logDebugInfo() {
  for (const [domain, time] of domainTimeMap.entries()) {
    const hours = Math.floor(time / (60 * 60 * 1000))
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((time % (60 * 1000)) / 1000)
  }
}

setInterval(checkOpenTabs, 5000)
setInterval(logDebugInfo, 60000)

chrome.tabs.onCreated.addListener(() => checkOpenTabs())
chrome.tabs.onUpdated.addListener(() => checkOpenTabs())
chrome.tabs.onRemoved.addListener(() => checkOpenTabs())

function setupMidnightReset() {
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
