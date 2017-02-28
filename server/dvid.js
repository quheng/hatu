import fetch from 'isomorphic-fetch'
import _ from 'lodash'

export const dvidAddress = 'http://dvid:8000'
export let uuid = ''

async function deleteInstanceWithWrongType (uuid, dataname) {
  console.log('drop it and create new one')
  const deleteInfo = await fetch(`${dvidAddress}/api/repo/${uuid}/${dataname}?imsure=true`, {
    method: 'DELETE'
  })
  if (deleteInfo.status !== 200) {
    const info = await deleteInfo.text()
    console.log('failed to delete', info)
    process.exit(-1)
  }
}

async function createInstance (uuid, typename, dataname) {
  const create = await fetch(`${dvidAddress}/api/repo/${uuid}/instance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typename: typename,
      dataname: dataname
    })
  })
  if (create.status !== 200) {
    const info = await create.text()
    console.log('failed to create', info)
    process.exit(-1)
  }
}

/**
 *
 * @param uuid
 * @param typename
 * @param dataname
 * @return {Promise.<boolean>} true for creating a new instance, false for not.
 */
async function setupInstance (uuid, typename, dataname) {
  const response = await fetch(`${dvidAddress}/api/repo/${uuid}/info`, {
    method: 'GET'
  })
  const responseObj = JSON.parse(await response.text())
  const dataInstances = responseObj['DataInstances']
  const instance = dataInstances[dataname]
  if (instance) {
    const typeName = instance['Base']['TypeName']
    if (typeName === typename) {
      console.log(`already exist ${typeName} instance named ${dataname}`)
      return false
    } else {
      console.log(`already exist ${dataname} instance but type is: ${typeName}`)
      await deleteInstanceWithWrongType(uuid, dataname)
    }
  }
  console.log(`create ${typename} instance named ${dataname}`)
  await createInstance(uuid, typename, dataname)
  return true
}

async function setImageTileMetadata (uuid, dataname) {
  const create = await fetch(`${dvidAddress}/api/node/${uuid}/${dataname}/metadata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'MinTileCoord': [0, 0, 0],
      'MaxTileCoord': [5, 5, 4],
      'Levels': {
        '0': { 'Resolution': [10.0, 10.0, 10.0], 'TileSize': [1024, 1024, 1024] },
        '1': { 'Resolution': [20.0, 20.0, 20.0], 'TileSize': [1024, 1024, 1024] },
        '2': { 'Resolution': [40.0, 40.0, 40.0], 'TileSize': [1024, 1024, 1024] },
        '3': { 'Resolution': [80.0, 80.0, 80.0], 'TileSize': [1024, 1024, 1024] }
      }
    }
    )
  })

  if (create.status !== 200) {
    const info = await create.text()
    console.log('failed to set image tile metadata', info)
    process.exit(-1)
  }
}

async function setupKeyValueInstance (uuid) {
  await setupInstance(uuid, 'keyvalue', 'swc')
}

async function setupImageTileInstance (uuid) {
  if (await setupInstance(uuid, 'imagetile', 'slice15')) {
    console.log('set image tile metadata')
    await setImageTileMetadata(uuid, 'slice15')
  }
}

async function getRepoUuid () {
  let uuid
  const response = await fetch(`${dvidAddress}/api/repos/info`, {
    method: 'GET'
  })
  const responseObj = JSON.parse(await response.text())

  if (!_.isEmpty(responseObj)) {
    uuid = _.keys(responseObj)[0]
    console.log('dvid has repo, use first one, uuid is ', uuid)
  } else {
    console.log('dvid has no repo, creating a new one')
    const response = await fetch(`${dvidAddress}/api/repos`, {
      method: 'POST'
    })
    const responseObj = JSON.parse(await response.text())
    uuid = responseObj['root']
    console.log('uuid of new repo is: ', uuid)
  }
  return uuid
}

export async function setupDvid () {
  try {
    uuid = await getRepoUuid()
    await setupKeyValueInstance(uuid)
    await setupImageTileInstance(uuid)
    return uuid
  } catch (err) {
    console.log('failed to connect dvid', err)
    process.exit(-1)
  }
}
