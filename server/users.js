import passport from 'passport'
import express from 'express'
import Sequelize from 'sequelize'

import { Strategy as LocalStrategy } from 'passport-local'

passport.use(new LocalStrategy((username, password, done) => {
  if (password === '!!!!') {
    return done(null, 'success')
  } else {
    return done(null, false)
  }
})
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})


export default (database) => {
  const userRouter = express.Router()
  const User = database.define('user_info', {
    username: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING
    }
  })
  userRouter.post('/login',
    passport.authenticate('local'),
    (req, res) => {
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
    User.sync().then(function () {
      // Table created
      return User.create({
        username,
        password
      })
    }).then(res => {
      console.log(res)
    })
  })
  return userRouter
}
