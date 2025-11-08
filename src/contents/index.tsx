import type { PlasmoGetStyle } from 'plasmo'
import type { Data, ConfigData } from '../shared/types'
import { useState, useEffect } from 'react'
import { sendToBackground } from "@plasmohq/messaging"
import { DELAY_DEFAULT, DURATION_LIST } from '../shared/constants'
import { diffMs, parseElapsed } from '../shared/elapsed'
import styleText from "data-text:../shared/style.css"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style')
  style.textContent = styleText
  return style
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
  const diff = Math.abs(diffMs({
    duration,
    elapsed
  }))
  const bgStyle = diff < DURATION_LIST[0].value ? 'bg-red-300' : diff < DURATION_LIST[1].value ? 'bg-yellow-300' : 'bg-green-400'

  return (
    <div className={`fixed font-bold font-sans select-none ${bgStyle}`}>
      {parseElapsed({
        duration,
        elapsed
      })}
    </div>
  )
}

const Cover = () => {
  const [width, widthSet] = useState<number>(document.documentElement.clientWidth)
  const [height, heightSet] = useState<number>(document.documentElement.scrollHeight)
  const [data, dataSet] = useState<{
    isMatch: boolean;
    elapsed: Data['elapsed'];
    duration: Data['duration'];
  }>({
    isMatch: false,
    elapsed: 0,
    duration: 0
  })
  const [isElapsedShow, isElapsedShowSet] = useState<ConfigData['isElapsedShow']>(false)

  useEffect(() => {
    const handleResize = () => {
      widthSet(document.documentElement.clientWidth)
      heightSet(document.documentElement.scrollHeight)
    }

    const handleScroll = () => {
      heightSet(document.documentElement.scrollHeight)
    }

    const checkElapsedGrayscale = async () => {
      const data = await sendToBackground({
        name: 'ping',
        body: {
          domain: _currentHostname()
        }
      })

      dataSet(data)

      const config = await sendToBackground({
        name: 'config'
      })

      if (config) {
        isElapsedShowSet(config.isElapsedShow)
      }

      if (data.isGrayscaleEnabled) {
        document.documentElement.style.filter = 'grayscale(100%)'
      } else {
        document.documentElement.style.filter = 'none'
      }
    }

    checkElapsedGrayscale()

    setInterval(() => checkElapsedGrayscale(), DELAY_DEFAULT)

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (data.elapsed <= data.duration) {
    if (isElapsedShow && data.isMatch) {
      return <Elapsed
        elapsed={data.elapsed}
        duration={data.duration}
      />
    }
    return <></>
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      <div className="grid w-full h-full justify-center items-center backdrop-blur-md"></div>
    </div>
  )
}

export default Cover
