import type { PlasmoMessaging } from '@plasmohq/messaging'
import type { Data } from '~/shared/types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL } from '~/shared/constants'

const storage = new Storage()

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data: Data[] = await storage.get(STORAGE_LABEL)
  const { domain }: { domain: Data['domain'] } = req.body
  const value = data.find(v => v.domain === domain)

  if (value) {
    res.send({
      elapsed: value.elapsed,
      duration: value.duration
    })
  }

  res.send({
    elapsed: 0,
    duration: 0
  })
}

export default handler
