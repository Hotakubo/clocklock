import type { PlasmoCSConfig, PlasmoGetStyle } from 'plasmo'
import type { Data, ConfigData } from '~/shared/types'
import { useState, useEffect } from 'react'
import { sendToBackground } from "@plasmohq/messaging"
import { DELAY } from '~/shared/constants'
import { parseElapsed } from '~/shared/elapsed'
import styleText from "data-text:~/shared/style.css"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style')
  style.textContent = styleText
  return style
}

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

const Elapsed = ({
  elapsed,
  duration
}: {
  elapsed: Data['elapsed'];
  duration: Data['duration'];
}) => {
  return (
    <div className="grid justify-center w-24 mt-2 ml-2 p-2 bg-white border-2 border-gray-300 font-bold">
      {parseElapsed({
        startDuration: duration,
        elapsed
      })}
    </div>
  )
}

const Cover = () => {
  const [width, widthSet] = useState<number>(document.documentElement.clientWidth)
  const [height, heightSet] = useState<number>(document.documentElement.scrollHeight)
  const [elapsed, elapsedSet] = useState<Data['elapsed']>(0)
  const [duration, durationSet] = useState<Data['duration']>(0)
  const [isElapsedShow, isElapsedShowSet] = useState<ConfigData['isElapsedShow']>(false)

  useEffect(() => {
    const handleResize = () => {
      widthSet(document.documentElement.clientWidth)
      heightSet(document.documentElement.scrollHeight)
    }

    const handleScroll = () => {
      heightSet(document.documentElement.scrollHeight)
    }

    const checkElapsed = async () => {
      const data = await sendToBackground({
        name: 'ping',
        body: {
          domain: _currentHostname()
        }
      })

      elapsedSet(data.elapsed)
      durationSet(data.duration)

      const config = await sendToBackground({
        name: 'config'
      })

      if (config) {
        isElapsedShowSet(config.isElapsedShow)
      }
    }

    checkElapsed()

    setInterval(() => checkElapsed(), DELAY)

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (elapsed <= duration) {
    if (isElapsedShow) {
      return <Elapsed
        elapsed={elapsed}
        duration={duration}
      />
    }
    return <></>
  }

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
          backdropFilter: "blur(10px)"
        }}
      >
      </div>
    </div>
  )
}

export default Cover
