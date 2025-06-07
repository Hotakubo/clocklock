import React from 'react'

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 border-gray-300 rounded-sm focus:ring-blue-500 cursor-pointer"
      />
      <span>{label}</span>
    </label>
  )
}

export default Checkbox
