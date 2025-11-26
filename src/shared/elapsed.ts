import type { Data } from '../shared/types'
import { intervalToDuration, differenceInMilliseconds } from 'date-fns'
import { urlToDomain } from '../shared/parsed'

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

  return diff < 0 ? `00:00` : `${hours}:${minutes}`
}

export const tabsToDomains = async () => {
  const tabs = await chrome.tabs.query({})

  return tabs.filter(tab => urlToDomain({ url: tab.url }) !== '').map(v => urlToDomain({ url: v.url }))
}
