import { useState, useEffect } from 'react'
import { Storage } from '@plasmohq/storage'
import Select from './parts/Select'
import Snackbar from './parts/Snackbar'
import { STORAGE_LABEL } from './constants'
import './style.css'

type Data = {
  id: number;
  domain: string;
  duration: number;
  elapsed: number;
  updatedDate: number;
}

const storage = new Storage()

const durationList =[
  { name: '5 minutes', value: 5 * 60 * 1000 },
  { name: '10 minutes', value: 10 * 60 * 1000 },
  { name: '30 minutes', value: 30 * 60 * 1000 },
  { name: '1 hour', value: 1 * 60 * 60 * 1000 },
  { name: '2 hours', value: 2 * 60 * 60 * 1000 },
  { name: '3 hours', value: 3 * 60 * 60 * 1000 },
  { name: '4 hours', value: 4 * 60 * 60 * 1000 },
  { name: '5 hours', value: 5 * 60 * 60 * 1000 },
  { name: '6 hours', value: 6 * 60 * 60 * 1000 }
]

const dataList = [
  {
    id: 1,
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    id: 2,
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    id: 3,
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    id: 4,
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    id: 5,
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  }
]

const Domain = ({
  value,
  onChange,
  placeholder
}: {
  value: string,
  onChange: (value: string) => void,
  placeholder: string
}) => {
  return (
    <input
      type="url"
      className="p-1 rounded-md border border-gray-400 outline-none w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function Options() {
  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    text: string;
    type: 'info' | 'error';
  } | null>(null);

  const [data, dataSet] = useState(dataList)

  useEffect(() => {
    const getData = async () => {
      const data: Data[] = await storage.get(STORAGE_LABEL)

      if (data) {
        dataSet(data)
      }
    }

    getData()
  }, [])

  const onChange = (value: {
    id: number;
    domain: string;
    duration: number;
  }) => {
    const nextData = data.map(v => v.id === value.id ? { ...v,
      domain: value.domain,
      duration: value.duration,
      elapsed: v.elapsed,
      updatedDate: v.updatedDate
    } : v)

    dataSet(nextData)
  }

  const onSave = async (value: {
    id: number;
    domain: string;
    duration: number;
  }) => {
    if (!value.domain.trim()) {
      setSnackbar({
        show: true,
        text: 'Please enter a domain.',
        type: 'error'
      })
      return
    }
    const nextData = data.map(v => v.id === value.id ? { ...v,
      domain: value.domain,
      duration: value.duration,
      elapsed: v.elapsed,
      updatedDate: v.updatedDate
    } : v)

    await storage.set(STORAGE_LABEL, nextData)

    setSnackbar({
      show: true,
      text: 'Saved successfully.',
      type: 'info'
    })
  }

  return (
    <div className="grid justify-center">
      <div className="grid gap-3 w-[30rem] mt-4 p-3 rounded-md border border-gray-400 text-gray-600 text-sm">
        {data.map(v => {
          return (
            <div key={v.id} className="flex items-center gap-2">
              <Domain
                placeholder="domain.net"
                value={v.domain}
                onChange={(value) => onChange({
                  id: v.id,
                  domain: value,
                  duration: v.duration
                })}
              />
              <div className="w-[8rem] rounded-md border border-gray-400 text-gray-600">
                <Select
                  options={durationList}
                  selected={v.duration}
                  onChange={(value) => onChange({
                    id: v.id,
                    domain: v.domain,
                    duration: parseInt(value.target.value)
                  })}
                />
              </div>
              <button
                className="p-1 rounded-md border border-gray-400 text-gray-600 text-sm"
                onClick={() => onSave(v)}
              >
                SAVE
              </button>
            </div>
          )
        })}
      </div>
      {snackbar && snackbar.show && (
        <Snackbar
          text={snackbar.text}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  )
}

export default Options
