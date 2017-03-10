import passport from 'passport'
import express from 'express'

import { Strategy as LocalStrategy } from 'passport-local'

passport.use(new LocalStrategy((username, password, done) => {
  if (password === "!!!!") {
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

export const userRouter = express.Router()

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

