import type { PlasmoCSConfig } from 'plasmo'
import { useState, useEffect } from 'react'
import { sendToBackground } from "@plasmohq/messaging"
import { DELAY } from '~/shared/constants'

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const _currentHostname = (): string => {
  const hostname = window.location.hostname

  return hostname
}

const Cover = () => {
  const [isElapsed, isElapsedSet] = useState<boolean | null>(null)

  useEffect(() => {
    const checkElapsed = async () => {
      const res = await sendToBackground({
        name: 'ping',
        body: {
          domain: _currentHostname()
        }
      })

      isElapsedSet(res.isElapsed)
    }

    setInterval(() => checkElapsed(), DELAY)
  }, [])

  if (!isElapsed) return <></>

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        justifyItems: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "95%",
          height: "95%",
          display: "grid",
          justifyItems: "center",
          alignItems: "center",
          padding: "8px",
          borderRadius: "12px",
          background: "rgba(255, 192, 203, 0.9)",
          backdropFilter: "blur(5px)"
        }}
      >
      </div>
    </div>
  )
}

export default Cover
