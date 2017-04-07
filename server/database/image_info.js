import passport from 'passport'
import express from 'express'
import Sequelize from 'sequelize'

import database from './database'
import ImageInstance from '../image/ImageInstance'

async function initImageInfo() {
  const imageDao = database.define('image_info', {
    username: {
      type: Sequelize.STRING,
      references: {
        model: 'user_infos',
        key: 'username',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    image: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    }
  }, {
    indexes: [{
      name: 'images_by_user',
      fields: ['username']
    }]
  })

  await imageDao.sync()

  const initUser = 'hatu'
  const initRole = 'owner'
  const initImage = 'slice15'

  await imageDao.findOrCreate({
    where: {username: initUser},
    defaults: {
      image: initImage,
      role: initRole
    }
  })
  return imageDao
}


export default async function () {
  const imageRouter = express.Router()
  const imageDao = await initImageInfo()

  imageRouter.get('/images', (req, res) => {
    imageDao.findAll({
      where: {
        username: req.user.username
      }
    }).then((images) => {
      res.send(images)
    })
  })

  imageRouter.get('/image/:name', (req, res) => {
    const elevation = Number(req.query.elevation)
    const left = Math.round(Number(req.query.left))
    const right = Math.round(Number(req.query.right))
    const top = Math.round(Number(req.query.top))
    const bottom = Math.round(Number(req.query.bottom))
    
    const imageInstance = new ImageInstance(req.params.name, 256)
    imageInstance.retrieve(left, right, top, bottom, elevation)
      .then(data => {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' })
        res.write(data, 'binary')
        res.end()
      })
  })

  return imageRouter
}
