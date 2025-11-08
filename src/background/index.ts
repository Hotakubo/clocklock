import type { Data } from '../shared/types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL, DELAY_DEFAULT } from '../shared/constants'
import { tabsToDomains } from '../shared/elapsed'

const storage = new Storage()

const _isResetDate = ({ updatedDate }: { updatedDate: Data['updatedDate'] }) => {
  const today = new Date()
  const updateDay = new Date(updatedDate)

  today.setHours(0, 0, 0, 0)
  updateDay.setHours(0, 0, 0, 0)

  return updateDay < today
}

const _isDomainMatch = ({
  tabDomains,
  storageDomain,
}: {
  tabDomains: Data['domain'][];
  storageDomain: {
    domain: Data['domain']
    isSubdomainIncluded: Data['isSubdomainIncluded']
  }
}) => {
  return tabDomains.some(v => {
    if (storageDomain.isSubdomainIncluded) {
      return v.endsWith(storageDomain.domain)
    }
    return v === storageDomain.domain
  })
}

const _getCoverContentScript = (() => {
  let cachedScript: string | null = null

  return (): string | null => {
    if (cachedScript !== null) {
      return cachedScript
    }

    const manifest = chrome.runtime.getManifest()
    const scripts =
      manifest.content_scripts?.flatMap(script => script.js ?? []) ?? []

    cachedScript =
      scripts.find(script => script.startsWith('contents.')) ??
      scripts.find(script => script.startsWith('content.')) ??
      null

    return cachedScript
  }
})()

const checkOpenTabs = async () => {
  const data: Data[] = await storage.get(STORAGE_LABEL)

  if (!data) return

  const domains = await tabsToDomains()
  let hasChanges = false

  for (const v of data) {
    const isMatch = _isDomainMatch({
      tabDomains: domains,
      storageDomain: {
        domain: v.domain,
        isSubdomainIncluded: v.isSubdomainIncluded
      }
    })

    if (isMatch && v.elapsed <= v.duration) {
      v.elapsed = v.elapsed + DELAY_DEFAULT
      hasChanges = true
    }

    if (_isResetDate({ updatedDate: v.updatedDate })) {
      v.elapsed = 0
      v.updatedDate = new Date().getTime()
      hasChanges = true
    }
  }

  if (hasChanges) {
    await storage.set(STORAGE_LABEL, data)
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const data: Data[] = await storage.get(STORAGE_LABEL)

    if (!data) return

    const hostname = new URL(tab.url).hostname

    const isMatch = data.some(v => _isDomainMatch({
        tabDomains: [hostname],
        storageDomain: {
          domain: v.domain,
          isSubdomainIncluded: v.isSubdomainIncluded
        }
      }))

    const contentScript = _getCoverContentScript()

    if (isMatch && contentScript) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: [contentScript]
      })
    }
  }
})

setInterval(() => checkOpenTabs(), DELAY_DEFAULT)
