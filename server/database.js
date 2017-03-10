import Sequelize from 'sequelize'
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

const database = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

export default database
