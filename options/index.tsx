import type { Data } from '~/shared/types'
import { z } from 'zod'
import { useState, useEffect, useId } from 'react'
import { Storage } from '@plasmohq/storage'
import Select from '~/parts/Select'
import Checkbox from '~/parts/Checkbox'
import Snackbar from '~/parts/Snackbar'
import Add from '~/parts/Add'
import Delete from '~/parts/Delete'
import { STORAGE_LABEL, DURATION_LIST } from '~/shared/constants'
import '~/shared/style.css'

const schema = {
  domain: z.string().regex(
    /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/,
    'Invalid domain format'
  )
}

const storage = new Storage()

const DATA = {
  domain: '',
  isSubdomainIncluded: false,
  isGrayscaleEnabled: false,
  duration: 1 * 60 * 60 * 1000,
  elapsed: 0,
  updatedDate: new Date().getTime()
}

const _isDuplicateDomains = ({ domains }: { domains: Data['domain'][] }) => {
  const uniqueDomains = new Set(domains)
  return domains.length !== uniqueDomains.size
}

const _normalize = (data: Data[]) => {
  for (const v of data) {
    v.domain = v.domain.trim()
  }
  return data
}

const _check = (data: { domain: Data['domain'] }[]) => {
  for (const v of data) {
    if (v.domain === '') continue
    if (schema.domain.safeParse(v.domain).success === false) {
      return 'Invalid domain format.'
    }
  }

  if (_isDuplicateDomains({ domains: data.map(v => v.domain).filter(v => v !== '') })) {
    return 'Duplicate domains are not allowed.'
  }

  return null
}

const _urlToDomain = ({ url }: { url: string }) => {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
  } catch (e) {
    return ''
  }
}

const Domain = ({
  value,
  onChange,
  onBlur = () => {},
  placeholder
}: {
  value: string,
  onChange: (value: string) => void,
  onBlur?: () => void,
  placeholder: string
}) => {
  return (
    <input
      type="url"
      className="p-1 rounded-md border border-gray-400 outline-none w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => onBlur()}
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
  const [draftData, draftDataSet] = useState([ DATA ])

  useEffect(() => {
    const getData = async () => {
      const storageData: Data[] = await storage.get(STORAGE_LABEL)

      if (storageData) {
        draftDataSet(structuredClone(storageData))
      }
    }

    getData()
  }, [])

  const onChange = ({
    index,
    domain,
    isSubdomainIncluded,
    isGrayscaleEnabled,
    duration
  }: {
    index: number;
    domain: Data['domain'];
    isSubdomainIncluded: Data['isSubdomainIncluded'];
    isGrayscaleEnabled: Data['isGrayscaleEnabled'];
    duration: Data['duration'];
  }) => {
    const nextData = draftData.map((v, i) => i === index ? { ...v,
      domain,
      isSubdomainIncluded,
      isGrayscaleEnabled,
      duration
    } : v)

    draftDataSet(nextData)
  }

  const onBlur = ({
    domain
  }: {
    domain: Data['domain'];
  }) => {
    const normalizedDomain = _urlToDomain({ url: domain })

    if (normalizedDomain !== '') {
      const nextData = draftData.map(v => v.domain === domain ? { ...v, domain: normalizedDomain } : v)
      draftDataSet(nextData)
    }
  }

  const onAdd = () => {
    const clonedData: Data[] = structuredClone(draftData)
    const normalizedData = _normalize(clonedData)
    const checkResult = _check(normalizedData)

    if (checkResult) {
      setSnackbar({
        show: true,
        text: checkResult,
        type: 'error'
      })
      return
    }

    draftDataSet([...normalizedData, DATA])
  }

  const onDelete = (index: number) => {
    const nextData = draftData.filter((_, i) => i !== index)

    draftDataSet(nextData)
  }

  const onSave = async () => {
    const storageData: Data[] = await storage.get(STORAGE_LABEL)
    const saveData = _normalize(draftData).filter(v => v.domain !== '')
    const checkResult = _check(saveData)
    const getStorageData = (domain: Data['domain']) => storageData.find(({ domain: v }) => v === domain)

    if (checkResult) {
      setSnackbar({
        show: true,
        text: checkResult,
        type: 'error'
      })
      return
    }

    for (const v of saveData) {
      const liveValue = getStorageData(v.domain)

      if (liveValue) {
        v.elapsed = liveValue.elapsed
      } else {
        v.elapsed = 0
      }
    }

    await storage.set(STORAGE_LABEL, saveData)

    draftDataSet(structuredClone(saveData))

    setSnackbar({
      show: true,
      text: 'Saved successfully.',
      type: 'info'
    })
  }

  return (
    <div className="grid gap-3 pt-4 justify-center">
      <div className="grid justify-end">
        <button
          className="h-[2.5rem] w-[5rem] p-1 rounded-md border border-gray-400 text-gray-600 text-sm active:bg-gray-200"
          onClick={() => onSave()}
        >
          SAVE
        </button>
      </div>
      <div className="grid gap-4 w-[30rem] text-gray-600 text-sm">
        {draftData.map((v, i) => {
          return (
            <div key={`${id}${i}`} className="grid grid-cols-7 gap-2 p-3 rounded-md border border-gray-400">
              <p className="col-span-7 font-semibold">Restricted page {i + 1}</p>
              <div className="col-span-5">
                <Domain
                  placeholder="example.com"
                  value={v.domain}
                  onChange={value => onChange({
                    index: i,
                    domain: value,
                    isSubdomainIncluded: v.isSubdomainIncluded,
                    isGrayscaleEnabled: v.isGrayscaleEnabled,
                    duration: v.duration
                  })}
                  onBlur={() => onBlur({ domain: v.domain })}
                />
              </div>
              <div className="col-span-2 rounded-md border border-gray-400 text-gray-600">
                <Select
                  options={DURATION_LIST}
                  selected={v.duration}
                  onChange={value => onChange({
                    index: i,
                    domain: v.domain,
                    isSubdomainIncluded: v.isSubdomainIncluded,
                    isGrayscaleEnabled: v.isGrayscaleEnabled,
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
                    isGrayscaleEnabled: v.isGrayscaleEnabled,
                    duration: v.duration
                  })}
                  label="All sites ending in this domain will be affected."
                />
              </div>
              <div className="col-span-7">
                <Checkbox
                  checked={v.isGrayscaleEnabled}
                  onChange={value => onChange({
                    index: i,
                    domain: v.domain,
                    isSubdomainIncluded: v.isSubdomainIncluded,
                    isGrayscaleEnabled: value,
                    duration: v.duration
                  })}
                  label="Turn it to grayscale."
                />
              </div>
              <div className="col-span-7">
                <Delete
                  onClick={() => onDelete(i)}
                  ariaLabel={`Delete restricted page ${i + 1}`}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="grid justify-center">
        <Add
          onClick={() => onAdd()}
        />
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
