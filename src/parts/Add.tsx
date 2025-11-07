import * as Md from 'react-icons/md'

type Props = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function Add(props: Props) {
  const className = [
    'inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-400 text-xl text-gray-600 bg-white active:bg-gray-200 transition-colors duration-150',
    'disabled:cursor-not-allowed disabled:opacity-60',
    props.className
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.ariaLabel ?? 'Add element'}
      className={className}
    >
      <Md.MdAdd aria-hidden="true" />
    </button>
  )
}
