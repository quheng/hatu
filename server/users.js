import passport from 'passport'
import express from 'express'

import { getPassword } from './database'
import { Strategy as LocalStrategy } from 'passport-local'

passport.use(new LocalStrategy((username, password, done) => {
  getPassword(username)
    .then(res => {
      if (res === password){
        return 'success'
      } else {
        throw new Error('fail')
      }
    })
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

export const userRouter = express.Router()

userRouter.route('/login')
  .post(passport.authenticate('local'), (req, res) => {
    res.json({ messages: ['success'] })
  })

userRouter.post('/logout', (req, res) => {
  req.logout()
  res.status(200)
    .json({ messages: ['success'] })
})

