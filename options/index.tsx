import type { Data } from '~/shared/types'
import { z } from 'zod'
import { useState, useEffect, useId } from 'react'
import { Storage } from '@plasmohq/storage'
import Select from '~/parts/Select'
import Checkbox from '~/parts/Checkbox'
import Snackbar from '~/parts/Snackbar'
import { STORAGE_LABEL } from '~/shared/constants'
import '~/shared/style.css'

const domainSchema = z.string().regex(
  /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/,
  'Invalid domain format'
)

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
    isSubdomainIncluded: false,
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    domain: '',
    isSubdomainIncluded: false,
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    domain: '',
    isSubdomainIncluded: false,
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    domain: '',
    isSubdomainIncluded: false,
    duration: 1 * 60 * 60 * 1000,
    elapsed: 0,
    updatedDate: new Date().getTime()
  },
  {
    domain: '',
    isSubdomainIncluded: false,
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
  const [loadedData, loadedDataSet] = useState([])

  useEffect(() => {
    const getData = async () => {
      const data: Data[] = await storage.get(STORAGE_LABEL)

      if (data) {
        loadedDataSet(structuredClone(data))

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
    isSubdomainIncluded,
    duration
  }: {
    index: number;
    domain: Data['domain'];
    isSubdomainIncluded: Data['isSubdomainIncluded'];
    duration: Data['duration'];
  }) => {
    const nextData = data.map((v, i) => i === index ? { ...v,
      domain,
      isSubdomainIncluded,
      duration
    } : v)

    dataSet(nextData)
  }

  const onSave = async () => {
    const isDuplicateDomains = ({ domains }: { domains: Data['domain'][] }) => {
      const uniqueDomains = new Set(domains)
      return domains.length !== uniqueDomains.size
    }
    const currentData: Data[] = await storage.get(STORAGE_LABEL)

    for (const v of data) {
      v.domain = v.domain.trim()

      if (v.domain === '') continue
      if (domainSchema.safeParse(v.domain).success === false) {
        setSnackbar({
          show: true,
          text: 'Invalid domain format.',
          type: 'error'
        })
      }

      if (loadedData.map(h => h.domain).includes(v.domain)) {
        const oneData = currentData.find(h => h.domain === v.domain)

        if (oneData) {
          v.elapsed = oneData.elapsed
        }
      } else{
        v.elapsed = 0
      }
    }

    if (isDuplicateDomains({ domains: data.map(v => v.domain).filter(v => v !== '') })) {
      setSnackbar({
        show: true,
        text: 'Duplicate domains are not allowed.',
        type: 'error'
      })
      return
    }

    await storage.set(STORAGE_LABEL, data.filter(v => v.domain !== ''))

    dataSet(data)
    loadedDataSet(structuredClone(data.filter(v => v.domain !== '')))

    setSnackbar({
      show: true,
      text: 'Saved successfully.',
      type: 'info'
    })
  }

  return (
    <div className="grid gap-3 justify-center">
      <div className="grid gap-4 w-[30rem] mt-4 text-gray-600 text-sm">
        {data.map((v, i) => {
          return (
            <div key={`${id}${i}`} className="grid grid-cols-7 gap-2 p-3 rounded-md border border-gray-400">
              <div className="col-span-5">
                <Domain
                  placeholder="example.com"
                  value={v.domain}
                  onChange={value => onChange({
                    index: i,
                    domain: value,
                    isSubdomainIncluded: v.isSubdomainIncluded,
                    duration: v.duration
                  })}
                />
              </div>
              <div className="col-span-2 rounded-md border border-gray-400 text-gray-600">
                <Select
                  options={durationList}
                  selected={v.duration}
                  onChange={value => onChange({
                    index: i,
                    domain: v.domain,
                    isSubdomainIncluded: v.isSubdomainIncluded,
                    duration: parseInt(value.target.value)
                  })}
                />
              </div>
              <div className="col-span-7">
                <Checkbox
                  checked={v.isSubdomainIncluded}
                  onChange={value => onChange({
                    index: i,
                    domain: v.domain,
                    isSubdomainIncluded: value,
                    duration: v.duration
                  })}
                  label="All sites ending in this domain will be affected."
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
