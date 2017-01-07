import pg from 'pg'

if (!process.env.postgres_user) {
  console.error('postgres_user can not be null in environment variables')
  process.exit(-1)
}

if (!process.env.postgres_database) {
  console.error('postgres_database can not be null in environment variables')
  process.exit(-1)
}

if (!process.env.postgres_password) {
  console.error('postgres_password can not be null in environment variables')
  process.exit(-1)
}

if (!process.env.postgres_endpoint) {
  console.error('postgres_endpoint can not be null in environment variables')
  process.exit(-1)
}

if (!process.env.postgres_port) {
  console.error('postgres_port can not be null in environment variables')
  process.exit(-1)
}

const config = {
  user: process.env.postgres_user,
  database: process.env.postgres_database,
  password: process.env.postgres_password,
  host: process.env.postgres_endpoint,
  port: process.env.postgres_port,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}

const pool = new pg.Pool(config)

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
})

export const message = {
  EXIST: 'EXIST',
  NOTEXIST: 'NOTEXIST',
  INTERNAL: 'INTERNAL'
}

export const tableName = 'userinfo'

export function createUser (username, password, dvidInfo) {
  const sql = `INSERT INTO ${tableName} VALUES ($1, $2, $3)`
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
  const sql = `SELECT password FROM ${tableName} WHERE username=$1`
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

export function checkDatabase () {
  const sql = `SELECT to_regclass('${tableName}')`
  pool.connect(function (err, client, done) {
    if (err) {
      console.error('error fetching client from pool, message:', err)
      process.exit(-1)
    }
    client.query(sql, function (err, result) {
      if (err) {
        console.error('error running query: ', err)
        process.exit(-1)
      }
      if (result.rows[0].to_regclass === tableName) {
        console.error('connect to databse successfully')
      } else {
        console.error(`do not exist table called ${tableName} in current database`)
        process.exit(-1)
      }
    })
  })
}
