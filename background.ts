import type { Data } from './types'
import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL } from './constants'

const storage = new Storage()

const _isUpdateDate = ({ updatedDate }: { updatedDate: Data['updatedDate'] }) => {
}

const checkOpenTabs = async () => {
  const data: Data[] = await storage.get(STORAGE_LABEL)

  for (const v of data) {
  }
}

setInterval(() => checkOpenTabs(), 5000)
