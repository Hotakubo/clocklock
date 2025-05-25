import type { Data } from '~/shared/types'
import { useState, useEffect, useId } from 'react'
import { Storage } from '@plasmohq/storage'
import Select from '~/parts/Select'
import Snackbar from '~/parts/Snackbar'
import { STORAGE_LABEL } from '~/shared/constants'
import '~/shared/style.css'

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
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    domain: '',
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
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
  const id = useId()
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
        const setDataList = []

        for (let i = 0; i < dataList.length; i++) {
          if (data[i]) {
            setDataList.push(data[i])
          } else {
            setDataList.push(dataList[i])
          }
        }

        dataSet(setDataList)
      }
    }

    getData()
  }, [])

  const onChange = ({
    index,
    domain,
    duration
  }: {
    index: number;
    domain: Data['domain'];
    duration: Data['duration'];
  }) => {
    const nextData = data.map((v, i) => i === index ? { ...v,
      domain: domain,
      duration: duration
    } : v)

    dataSet(nextData)
  }

  const onSave = async () => {
    for (const v of data) {
      if (!v.domain.trim()) {
        setSnackbar({
          show: true,
          text: 'Please enter a domain.',
          type: 'error'
        })
        return
      }
    }

    const domains = data.map(v => v.domain.trim()).filter(v => v !== '')
    const uniqueDomains = new Set(domains)

    if (domains.length !== uniqueDomains.size) {
      setSnackbar({
        show: true,
        text: 'Duplicate domains are not allowed.',
        type: 'error'
      })
      return
    }

    await storage.set(STORAGE_LABEL, data.filter(v => v.domain.trim() !== ''))

    setSnackbar({
      show: true,
      text: 'Saved successfully.',
      type: 'info'
    })
  }

  const onReset = async () => {
    for (const v of data) {
      v.elapsed = 0
    }

    await storage.set(STORAGE_LABEL, data.filter(v => v.domain.trim() !== ''))

    setSnackbar({
      show: true,
      text: 'Reset successfully.',
      type: 'info'
    })
  }

  return (
    <div className="grid gap-3 justify-center">
      <div className="grid gap-3 w-[30rem] mt-4 p-3 rounded-md border border-gray-400 text-gray-600 text-sm">
        {data.map((v, i) => {
          return (
            <div key={`${id}${i}`} className="flex items-center gap-2">
              <Domain
                placeholder="domain.net"
                value={v.domain}
                onChange={value => onChange({
                  index: i,
                  domain: value,
                  duration: v.duration
                })}
              />
              <div className="w-[8rem] rounded-md border border-gray-400 text-gray-600">
                <Select
                  options={durationList}
                  selected={v.duration}
                  onChange={value => onChange({
                    index: i,
                    domain: v.domain,
                    duration: parseInt(value.target.value)
                  })}
                />
              </div>
            </div>
          )
        })}
      </div>
      <button
        className="p-1 rounded-md border border-gray-400 text-gray-600 text-sm active:bg-gray-200"
        onClick={() => onSave()}
      >
        SAVE
      </button>
      <button
        className="w-24 p-1 rounded-md border border-gray-400 text-gray-600 text-sm active:bg-gray-200"
        onClick={() => onReset()}
      >
        RESET
      </button>
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
