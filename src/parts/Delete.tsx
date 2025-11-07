import * as Md from 'react-icons/md'

type Props = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function Delete(props: Props) {
  const className = [
    'inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-400 text-xl text-red-500 bg-white hover:bg-red-50 active:bg-red-100 transition-colors duration-150',
    'disabled:cursor-not-allowed disabled:opacity-60',
    props.className
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.ariaLabel ?? 'Delete element'}
      className={className}
    >
      <Md.MdDelete aria-hidden="true" />
    </button>
  )
}
