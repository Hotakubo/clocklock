import type { PlasmoMessaging } from '@plasmohq/messaging'
import type { Data } from '~/shared/types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL } from '~/shared/constants'

const storage = new Storage()

const _getValue = async ({
  domain
}: {
  domain: Data['domain'];
}) => {
  const data: Data[] = await storage.get(STORAGE_LABEL)

  return data.find(v => domain.endsWith(v.domain)) || null
}

const _isDomainMatch = ({
  storageDomains,
  tabDomain,
}: {
  storageDomains: {
    domain: Data['domain'];
    isSubdomainIncluded: Data['isSubdomainIncluded'];
  }[];
  tabDomain: Data['domain'];
}) => {
  return storageDomains.some(v => {
    if (v.isSubdomainIncluded) {
      return tabDomain.endsWith(v.domain)
    }
    return v.domain === tabDomain
  })
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data: Data[] = await storage.get(STORAGE_LABEL)
  const { domain }: { domain: Data['domain'] } = req.body
  const value = await _getValue({ domain })

  if (value) {
    const isMatch = _isDomainMatch({
      storageDomains: data.map(v => ({
        domain: v.domain,
        isSubdomainIncluded: v.isSubdomainIncluded
      })),
      tabDomain: domain
    })

    res.send({
      isMatch,
      isGrayscaleEnabled: value.isGrayscaleEnabled,
      elapsed: value.elapsed,
      duration: value.duration
    })
  } else {
    res.send({
      isMatch: false,
      isGrayscaleEnabled: false,
      elapsed: 0,
      duration: 0
    })
  }
}

export default handler
