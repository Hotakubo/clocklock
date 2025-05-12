import { useState } from "react"
import "./style.css"

const Domain = ({
  value,
  onChange
}: {
  value: string,
  onChange: (value: string) => void
}) => {
  return (
    <input
      type="url"
      className="p-1 rounded-md border border-gray-400 outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function Options() {
  const [data, setData] = useState("")

  return (
    <div className="grid justify-center">
      <div className="w-[30rem] mt-4 p-2 rounded-md border border-gray-400 text-gray-600 text-sm">
        <Domain value={data} onChange={setData} />
      </div>
    </div>
  )
}

export default Options
