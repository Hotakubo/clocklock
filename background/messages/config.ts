import type { PlasmoMessaging } from '@plasmohq/messaging'
import type { ConfigData } from '~/shared/types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_CONFIG_LABEL } from '~/shared/constants'

const storage = new Storage()

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data: ConfigData = await storage.get(STORAGE_CONFIG_LABEL)

  console.log(data)
  if (data) {
    res.send({
      isElapsedShow: data.isElapsedShow,
      isGrayscaleEnabled: data.isGrayscaleEnabled
    })
  } else {
    res.send(null)
  }
}

export default handler
