import { Storage } from '@plasmohq/storage'
import { STORAGE_LABEL } from './constants'

const storage = new Storage()

const checkOpenTabs = async () => {
}

setInterval(() => checkOpenTabs(), 5000)
