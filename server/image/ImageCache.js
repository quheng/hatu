import NodeCache from 'node-cache'

export let imageCache
imageCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

