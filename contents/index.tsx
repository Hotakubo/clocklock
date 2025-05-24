import type { PlasmoCSConfig } from 'plasmo'
import { sendToBackground } from "@plasmohq/messaging"
import { logger } from '../shared/logger'
import { DELAY } from '../shared/constants'

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const _currentHostname = (): string => {
  const hostname = window.location.hostname

  return hostname
}

const checkElapsed = async () => {
  const res = await sendToBackground({
    name: 'ping',
    body: {
      domain: _currentHostname()
    }
  })
}

setInterval(() => checkElapsed(), DELAY)

export default function Contents() {
  return <div style={{ background: "black" }}></div>
}
