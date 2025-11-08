import type { Data } from '../shared/types'
import { intervalToDuration, differenceInMilliseconds } from 'date-fns'

export const diffMs = ({
  duration,
  elapsed
 }: {
  duration: Data['duration'];
  elapsed: Data['elapsed'];
}) => {
  return differenceInMilliseconds(new Date(duration), new Date(elapsed))
}

export const parseElapsed = ({
  duration,
  elapsed
 }: {
  duration: Data['duration'];
  elapsed: Data['elapsed'];
}) => {
  const diff = diffMs({
    duration: duration,
    elapsed: elapsed
  })

  const time = intervalToDuration({
    start: 0,
    end: Math.abs(diff)
  })
  const hours = time.hours ? String(time.hours).padStart(2, '0') : '00'
  const minutes = time.minutes ? String(time.minutes).padStart(2, '0') : '00'
  const seconds = time.seconds ? String(time.seconds).padStart(2, '0') : '00'

  return diff < 0 ? `00:00:00` : `${hours}:${minutes}:${seconds}`
}

const _isParsableUrl = (value?: string | null) => {
  if (!value) return false

  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const tabsToDomains = async () => {
  const tabs = await chrome.tabs.query({})
  const visibleTabs = tabs.filter(tab => _isParsableUrl(tab.url))

  return visibleTabs.map(tab => new URL(tab.url as string).hostname)
}
