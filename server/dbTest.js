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

export const tableName = 'weather'

export const message = {
  EXIST: 'EXIST',
  NOTEXIST: 'NOTEXIST',
  INTERNAL: 'INTERNAL'
}

export function insert (city, tempLo, tempHi, prcp) {
  const sql = `INSERT INTO ${tableName} VALUES ($1, $2, $3, $4)`
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        console.error('error fetching client from pool, message:', err)
        return resolve(message.INTERNAL)
      }
      client.query(sql, [city, tempLo, tempHi, prcp], function (err, result) {
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

export function select (city) {
  const sql = `SELECT temp_lo FROM ${tableName} WHERE city=$1`
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        console.error('error fetching client from pool, message:', err)
        return resolve(message.INTERNAL)
      }
      client.query(sql, [city], function (err, result) {
        if (err) {
          console.error('error running query: ', err)
          return resolve(message.INTERNAL)
        }
        if (result.rows.length === 0) {
          return resolve(message.NOTEXIST)
        }
        return resolve(result.rows[0].temp_lo)
      })
    })
  })
}
