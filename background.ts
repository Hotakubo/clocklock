import type { Data } from './types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL } from './constants'

const storage = new Storage()

const checkOpenTabs = async () => {
  const data: Data[] = await storage.get(STORAGE_LABEL)

  if (!data) return
}

setInterval(() => checkOpenTabs(), 5000)
