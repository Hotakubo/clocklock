import type { Data, ConfigData } from '~/shared/types'
import React, { useEffect, useState } from 'react'
import { intervalToDuration, differenceInMilliseconds } from 'date-fns'
import { Storage } from '@plasmohq/storage'
import {
  STORAGE_LABEL,
  STORAGE_CONFIG_LABEL,
  DELAY
} from '~/shared/constants'
import Checkbox from '~/parts/Checkbox'
import '~/shared/style.css'

const storage = new Storage()

const _parseElapsed = ({
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

const _durationStyle = ({
  elapsed,
  duration
}: {
  elapsed: Data['elapsed'];
  duration: Data['duration'];
}) => {
  const diff = differenceInMilliseconds(new Date(elapsed), new Date(duration))

  return diff > 0 ? 'text-red-600' : ''
}

const Popup = () => {
  const [data, dataSet] = useState<Data[]>([])
  const [isElapsedShow, isElapsedShowSet] = useState<ConfigData['isElapsedShow']>(false)

  useEffect(() => {
    const fetchData = async () => {
      const storedData: Data[] = await storage.get(STORAGE_LABEL)

      if (storedData) {
        dataSet(storedData)
      }

      const config: ConfigData = await storage.get(STORAGE_CONFIG_LABEL)

      if (config) {
        isElapsedShowSet(config.isElapsedShow)
      }
    }
    fetchData()

    const interval = setInterval(fetchData, DELAY)

    return () => clearInterval(interval)
  }, [])

  const onElapsedShow = async ({
    checked
  }: {
    checked: ConfigData['isElapsedShow'];
  }) => {
    isElapsedShowSet(checked)

    await storage.set(STORAGE_CONFIG_LABEL, { isElapsedShow: checked })
  }

  if (data.length === 0) {
    return <div className="w-40 p-4">No data available</div>
  }

  return (
    <div className="p-4">
      <div className="mb-2">
        <Checkbox
          label="Show Elapsed Time"
          checked={isElapsedShow}
          onChange={(v => onElapsedShow({ checked: v }))}
        />
      </div>
      <ul className="list-none">
        {data.map((v, index) => (
          <li key={index} className="flex gap-4 justify-between text-lg">
            <div>{v.domain}</div>
            <div className={`${_durationStyle({ elapsed: v.elapsed, duration: v.duration })}`}>{_parseElapsed({
              startDuration: v.duration,
              elapsed: v.elapsed
            })}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Popup
