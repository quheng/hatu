import fetch from 'isomorphic-fetch'
import _ from 'lodash'

export const dvidAddress = 'http://115.28.245.5:1111'

async function deleteSwcInstanceWithWrongType (uuid) {
  console.log('drop it and create new one')
  const deleteInfo = await fetch(dvidAddress + '/api/repo/' + uuid + '/swc?imsure=true', {
    method: 'DELETE'
  })
  if (deleteInfo.status !== 200) {
    const info = await deleteInfo.text()
    console.log('failed to delete', info)
    process.exit(-1)
  }
}

async function createSwcInstance (uuid) {
  const create = await fetch(dvidAddress + '/api/repo/' + uuid + '/instance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typename: 'keyvalue',
      dataname: 'swc'
    })
  })
  if (create.status !== 200) {
    const info = await create.text()
    console.log('failed to create', info)
    process.exit(-1)
  }
}

async function setupKeyValueInstance (uuid) {
  const response = await fetch(dvidAddress + '/api/repo/' + uuid + '/info', {
    method: 'GET'
  })
  const responseObj = JSON.parse(await response.text())
  const dataInstances = responseObj['DataInstances']
  const swc = dataInstances['swc']
  if (swc) {
    const typeName = swc['Base']['TypeName']
    if (typeName === 'keyvalue') {
      console.log('already exist keyValue instance named swc')
      return
    } else {
      console.log('already exist swc instance but type is: ' + typeName)
      await deleteSwcInstanceWithWrongType(uuid)
    }
  }
  console.log('create keyValue instance named swc')
  await createSwcInstance(uuid)
}

async function getRepoUuid () {
  let uuid
  const response = await fetch(dvidAddress + '/api/repos/info', {
    method: 'GET'
  })
  const responseObj = JSON.parse(await response.text())

  if (!_.isEmpty(responseObj)) {
    uuid = _.keys(responseObj)[0]
    console.log('dvid has repo, use first one, uuid is ', uuid)
  } else {
    console.log('dvid has no repo, creating a new one')
    const response = await fetch(dvidAddress + '/api/repos', {
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
    const uuid = await getRepoUuid()
    await setupKeyValueInstance(uuid)
    return uuid
  } catch (err) {
    console.log('failed to connect dvid', err)
    process.exit(-1)
  }
}
