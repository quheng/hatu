import pg from 'pg'

const config = {
  user: 'hatu_user',
  database: 'hatu_db',
  password: 'hatu_password',
  host: 'pg',
  port: '5432',
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
