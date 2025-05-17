import { useState } from 'react'
import Select from './parts/Select'
import Snackbar from './parts/Snackbar'
import "./style.css"

const limitTimeList =[
  { value: 5 * 60 * 1000, name: '5 minutes' },
  { value: 10 * 60 * 1000, name: '10 minutes' },
  { value: 30 * 60 * 1000, name: '30 minutes' },
  { value: 1 * 60 * 60 * 1000, name: '1 hour' },
  { value: 2 * 60 * 60 * 1000, name: '2 hours' },
  { value: 3 * 60 * 60 * 1000, name: '3 hours' },
  { value: 4 * 60 * 60 * 1000, name: '4 hours' },
  { value: 5 * 60 * 60 * 1000, name: '5 hours' },
  { value: 6 * 60 * 60 * 1000, name: '6 hours' }
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
    type: 'normal' | 'error';
  } | null>(null);

  const [data, dataSet] = useState([
    {
      id: 1,
      domain: '',
      limitTime: 0
    },
    {
      id: 2,
      domain: '',
      limitTime: 0
    },
    {
      id: 3,
      domain: '',
      limitTime: 0
    },
    {
      id: 4,
      domain: '',
      limitTime: 0
    },
    {
      id: 5,
      domain: '',
      limitTime: 0
    }
  ])

  const onChange = (newData: {
    id: number;
    domain: string;
    limitTime: number;
  }) => {
    console.log(newData)
    const nextData = data.map(v => v.id === newData.id ? { ...v,
      domain: newData.domain,
      limitTime: newData.limitTime
    } : v)

    dataSet(nextData)
  }

  const onSave = (value: {
    id: number;
    domain: string;
    limitTime: number;
  }) => {
    if (!value.domain.trim()) {
      setSnackbar({
        show: true,
        text: 'Please enter a domain.',
        type: 'error'
      })
      return
    }

    setSnackbar({
      show: true,
      text: 'Saved successfully.',
      type: 'normal'
    })
  }

  return (
    <div className="grid justify-center">
      <div className="grid gap-3 w-[30rem] mt-4 p-3 rounded-md border border-gray-400 text-gray-600 text-sm">
        {data.map(v => {
          return (
            <div key={v.id} className="flex items-center gap-2">
              <Domain
                placeholder="https://"
                value={v.domain}
                onChange={(value) => onChange({
                  id: v.id,
                  domain: value,
                  limitTime: v.limitTime
                })}
              />
              <div className="w-[8rem] rounded-md border border-gray-400 text-gray-600">
                <Select
                  options={limitTimeList}
                  selected={v.limitTime}
                  onChange={(value) => onChange({
                    id: v.id,
                    domain: v.domain,
                    limitTime: parseInt(value.target.value)
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
