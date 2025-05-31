import type { PlasmoCSConfig } from 'plasmo'
import { useState, useEffect } from 'react'
import { sendToBackground } from "@plasmohq/messaging"
import { DELAY } from '~/shared/constants'

export const config: PlasmoCSConfig = {
  matches: [
    'https://*/*',
    'http://*/*'
  ]
}

const _currentHostname = (): string => {
  const hostname = window.location.hostname

  return hostname
}

const Cover = () => {
  const [isElapsed, isElapsedSet] = useState<boolean>(false)
  const [width, widthSet] = useState<number>(document.documentElement.clientWidth)
  const [height, heightSet] = useState<number>(document.documentElement.scrollHeight)

  useEffect(() => {
    const handleResize = () => {
      widthSet(document.documentElement.clientWidth)
      heightSet(document.documentElement.scrollHeight)
    }
    const checkElapsed = async () => {
      const res = await sendToBackground({
        name: 'ping',
        body: {
          domain: _currentHostname()
        }
      })

      isElapsedSet(res.isElapsed)
    }

    checkElapsed()

    setInterval(() => checkElapsed(), DELAY)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!isElapsed) return <></>

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "grid",
        justifyItems: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          justifyItems: "center",
          alignItems: "center",
          background: "rgba(200, 200, 200, 0.9)",
          backdropFilter: "blur(5px)"
        }}
      >
      </div>
    </div>
  )
}

export default Cover
