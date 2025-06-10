import type { PlasmoMessaging } from '@plasmohq/messaging'
import type { Data } from '~/shared/types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL } from '~/shared/constants'
import { isDomainMatch, tabsToDomains } from '~/shared/elapsed'

const storage = new Storage()

const _getValue = async ({
  domain
}: {
  domain: Data['domain'];
}) => {
  const data: Data[] = await storage.get(STORAGE_LABEL)

  return data.find(v => domain.endsWith(v.domain)) || null
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { domain }: { domain: Data['domain'] } = req.body
  const domains = await tabsToDomains()
  const value = await _getValue({ domain })

  if (value) {
    const isMatch = isDomainMatch({
      domains,
      domain,
      isSubdomainIncluded: value.isSubdomainIncluded
    })

    res.send({
      isMatch,
      elapsed: value.elapsed,
      duration: value.duration
    })
  } else {
    res.send({
      isMatch: false,
      elapsed: 0,
      duration: 0
    })
  }
}

export default handler
