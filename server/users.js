import passport from 'passport'
import express from 'express'
import Sequelize from 'sequelize'
import crypto from 'crypto'
import uuid from 'uuid'
import _ from 'lodash'

import { Strategy as LocalStrategy } from 'passport-local'

const encrypt = (password, salt) => {
  return crypto.createHmac('sha256', salt)
    .update(password)
    .digest('hex')
}

async function setupPassport (userDao, done) {
  const loginFail = (done) => {
    done(null, false, { error: 'Incorrect username or password.' })
  }
  passport.use(new LocalStrategy((username, password, done) => {
    userDao.findByPrimary(username)
      .then(userInfo => {
        if (_.isEmpty(userInfo)) {
          loginFail(done)
        }
        const salt = userInfo.get('salt')
        const correctPassword = userInfo.get('password')
        if (correctPassword === encrypt(password, salt)) {
          const user = {
            username: userInfo.get('username')
          }
          done(null, user)
        } else {
          loginFail(done)
        }
      })
      .catch((e) => {
        console.error(e)
        loginFail(done)
      })
  }))

  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}

export default async function (database) {
  const userRouter = express.Router()
  const userDao = database.define('user_info', {
    username: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    }
  })

  await userDao.sync()
  await setupPassport(userDao)

  userRouter.post('/login',
    passport.authenticate('local'), (req, res) => {
      res.json({ messages: ['success'] })
    }
  )

  userRouter.post('/logout', (req, res) => {
    req.logout()
    res.status(200)
      .json({ messages: ['success'] })
  })

  userRouter.post('/signup', (req, res) => {
    const { username, password } = req.body
    const salt = uuid.v4()
    userDao.create({
      username,
      salt,
      password: encrypt(password, salt)
    }).then(() => {
      res.status(200)
        .json({ message: ['success'] })
    }).catch(() => {
      res.status(400)
        .json({ error: ['user already exist'] })
    })
  })
  return userRouter
}
