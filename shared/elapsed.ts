import type { Data } from '~/shared/types'
import { intervalToDuration, differenceInMilliseconds } from 'date-fns'

export const diffMs = ({
  startDuration,
  elapsed
 }: {
  startDuration: Data['duration'];
  elapsed: Data['elapsed'];
}) => {
  return Math.abs(differenceInMilliseconds(new Date(elapsed), new Date(startDuration)))
}

export const parseElapsed = ({
  startDuration,
  elapsed
 }: {
  startDuration: Data['duration'];
  elapsed: Data['elapsed'];
}) => {
  const diff = differenceInMilliseconds(new Date(elapsed), new Date(startDuration))

  const duration = intervalToDuration({
    start: 0,
    end: Math.abs(diff)
  })
  const hours = duration.hours ? String(duration.hours).padStart(2, '0') : '00'
  const minutes = duration.minutes ? String(duration.minutes).padStart(2, '0') : '00'
  const seconds = duration.seconds ? String(duration.seconds).padStart(2, '0') : '00'

  return `${diff > 0 ? '-' : ''}${hours}:${minutes}:${seconds}`
}

export const isDomainMatch = ({
  domains,
  domain,
  isSubdomainIncluded
}: {
  domains: Data['domain'][],
  domain: Data['domain'],
  isSubdomainIncluded: Data['isSubdomainIncluded']
}) => {
  if (isSubdomainIncluded) {
    return domains.some(v => v.endsWith(domain))
  }
  return domains.includes(domain)
}

export const tabsToDomains = async () => {
  const tabs = await chrome.tabs.query({})
  return tabs.map(v => new URL(v.url).hostname)
}
