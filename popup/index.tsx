import type { Data } from '~/shared/types'
import React, { useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL, DELAY } from '~/shared/constants'
import { intervalToDuration } from 'date-fns'
import '~/shared/style.css'

const storage = new Storage()

const _parseElapsed = ({ elapsed }: { elapsed: number }): string => {
  const duration = intervalToDuration({
    start: 0,
    end: elapsed
  })
  const hours = duration.hours ? `${duration.hours}` : 0
  const minutes = duration.minutes ? `${duration.minutes}` : 0
  const seconds = duration.seconds ? `${duration.seconds}` : 0

  return `${hours}:${minutes}:${seconds}`
}

const Popup = () => {
  const [data, dataSet] = useState<Data[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const storedData: Data[] = await storage.get(STORAGE_LABEL)
      if (storedData) {
        dataSet(storedData)
      }
    }
    fetchData()

    const interval = setInterval(fetchData, DELAY)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4">
      <ul className="list-none">
        {data.map((v, index) => (
          <li key={index} className="flex gap-1">
            <div>{v.domain}</div>
            <div>{_parseElapsed({ elapsed: v.elapsed })}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Popup
