import passport from 'passport'
import express from 'express'
import Sequelize from 'sequelize'
import _ from 'lodash'

import database from './database'

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
    console.log(imageDao)
    console.log({
      where: {
        username: req.user.username
      }
    })


    imageDao.findAll({
      where: {
        username: req.user.username
      }
    }).then((images) => {
      res.send(images)
    })
  })


  return imageRouter
}
