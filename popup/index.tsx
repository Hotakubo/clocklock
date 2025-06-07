import type { Data } from '~/shared/types'
import React, { useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL, DELAY } from '~/shared/constants'
import { format } from 'date-fns'
import '~/shared/style.css'

const storage = new Storage()

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
            <div>{format(v.elapsed * 1000, 'HH:mm:ss')}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Popup
