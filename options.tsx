import { useState } from "react"
import "./style.css"

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
      className="p-1 rounded-md border border-gray-400 outline-none"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function Options() {
  const [data, dataSet] = useState([
    {
      id: 1,
      domain: ''
    },
    {
      id: 2,
      domain: ''
    },
    {
      id: 3,
      domain: ''
    },
    {
      id: 4,
      domain: ''
    },
    {
      id: 5,
      domain: ''
    }
  ])

  const onChange = (newData: {
    id: number;
    domain: string;
  }) => {
    const nextData = data.map(v => v.id === newData.id ? { ...v, domain: newData.domain } : v)

    dataSet(nextData)
  }

  return (
    <div className="grid justify-center">
      <div className="grid gap-3 w-[30rem] mt-4 p-3 rounded-md border border-gray-400 text-gray-600 text-sm">
        {data.map(v => {
          return (
            <div key={v.id} className="flex items-center">
              <Domain
                placeholder="https://"
                value={v.domain}
                onChange={(value) => onChange({ id: v.id, domain: value })}
              />
              <button
                className="ml-2 p-1 rounded-md border border-gray-400 text-gray-600 text-sm"
              >
                SAVE
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Options
