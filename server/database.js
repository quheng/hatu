import pg from 'pg'
import _ from 'lodash'

if (_.isEmpty(process.env.PG_HOST)) {
  console.log('can not find pg host in environment variable')
  process.exit(-1)
}

if (_.isEmpty(process.env.PG_PORT)) {
  console.log('can not find pg host in environment variable')
  process.exit(-1)
}

if (_.isEmpty(process.env.PG_USER)) {
  console.log('can not find pg user in environment variable')
  process.exit(-1)
}

if (_.isEmpty(process.env.PG_PASSWORD)) {
  console.log('can not find pg password in environment variable')
  process.exit(-1)
}

if (_.isEmpty(process.env.PG_DATABASE)) {
  console.log('can not find pg database in environment variable')
  process.exit(-1)
}

const config = {
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}
const pool = new pg.Pool(config)

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
})

const message = {
  EXIST: 'EXIST',
  NOTEXIST: 'NOTEXIST',
  INTERNAL: 'INTERNAL'
}

const USER_INFO = 'USER_INFO'
const FILE_INFO = 'FILE_INFO'

export function createUser (username, password, dvidInfo) {
  const sql = `INSERT INTO ${USER_INFO} VALUES ($1, $2, $3)`
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        console.error('error fetching client from pool, message:', err)
        return resolve(message.INTERNAL)
      }
      client.query(sql, [username, password, dvidInfo], function (err, result) {
        if (err) {
          console.error('error running query: ', err)
          if (err.code === '23505') {
            return resolve(message.EXIST)
          }
          return resolve(message.INTERNAL)
        }
        return resolve(result)
      })
    })
  })
}

export function getPassword (username) {
  const sql = `SELECT password FROM ${USER_INFO} WHERE username=$1`
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        console.error('error fetching client from pool, message:', err)
        return resolve(message.INTERNAL)
      }
      client.query(sql, [username], function (err, result) {
        if (err) {
          console.error('error running query: ', err)
          return resolve(message.INTERNAL)
        }
        if (result.rows.length !== 1) {
          return resolve(message.NOTEXIST)
        }
        return resolve(result.rows[0].password)
      })
    })
  })
}

const checkUserInfoTable = (client) => {
  const createSql = `
    CREATE TABLE ${USER_INFO}
    (
     username VARCHAR(255) PRIMARY KEY NOT NULL,
     password VARCHAR(255) NOT NULL
    )`
  const checkSql = `SELECT to_regclass('${USER_INFO}')`

  client.query(checkSql, function (err, result) {
    if (err) {
      console.log('error checking user info: ', err)
      process.exit(-1)
    }
    if (result.rows[0].to_regclass === USER_INFO) {
      console.log('get user info table successfully')
    } else {
      console.log(`do not exist table called ${USER_INFO} in current database, create it`)
      client.query(createSql, function (err, result) {
        if (err) {
          console.log('error creating user info: ', err)
          process.exit(-1)
        } else {
          console.log('create user info successfully')
        }
      })
    }
  })
}

const createFileInfoTable = (client) => {
  const createSql = `
    CREATE TABLE ${FILE_INFO}
    (
     sliceId VARCHAR(255) PRIMARY KEY NOT NULL,
     swcId VARCHAR(255) NOT NULL,
     sliceName VARCHAR(255) NOT NULL,
     swcName VARCHAR(255) NOT NULL,
     username VARCHAR(255) NOT NULL references USER_INFO(username),
     updateAt TIMESTAMP
    )`
  const checkSql = `SELECT to_regclass('${FILE_INFO}')`

  client.query(checkSql, function (err, result) {
    if (err) {
      console.log('error checking file info: ', err)
      process.exit(-1)
    }
    if (result.rows[0].to_regclass === FILE_INFO) {
      console.log('get file info table successfully')
    } else {
      console.log(`do not exist table called ${FILE_INFO} in current database, create it`)
      client.query(createSql, function (err, result) {
        if (err) {
          console.log('error creating file info: ', err)
          process.exit(-1)
        } else {
          console.log('create file info successfully')
        }
      })
    }
  })
}

export function checkDatabase () {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('error fetching client from pool, message:', err)
      process.exit(-1)
    }
    checkUserInfoTable(client)
    createFileInfoTable(client)
  })
}
