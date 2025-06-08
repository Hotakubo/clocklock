import type { Data } from '~/shared/types'
import { intervalToDuration, differenceInMilliseconds } from 'date-fns'

export const parseElapsed = ({
  startDuration,
  elapsed
 }: {
  startDuration: Data['duration'];
  elapsed: Data['elapsed'];
}): string => {
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
