import { useEffect, useState } from 'react'

type SnackbarType = 'info' | 'error'

type Props = {
  text: string;
  type?: SnackbarType;
  duration?: number;
  onClose?: () => void;
}

export default function Snackbar({
  text,
  type = 'info',
  duration = 3000,
  onClose
}: Props) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) {
        setTimeout(onClose, 300)
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const backgroundColor = type === 'error' ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div
      className={`fixed top-0 left-0 right-0 flex justify-center transition-transform duration-300 ease-in-out z-50 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className={`${backgroundColor} text-white px-4 py-2 rounded-b-md shadow-md text-sm`}
      >
        {text}
      </div>
    </div>
  )
}
