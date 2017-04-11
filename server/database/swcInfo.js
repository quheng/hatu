import express from 'express'
import Sequelize from 'sequelize'

import database from './database'

import { initUser, initImage, initSwc } from './initValue'

async function initSwcInfo () {
  const swcDao = database.define('swc_info', {
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
    swc: {
      type: Sequelize.STRING
    },
    comments: {
      type: Sequelize.STRING
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    indexes: [{
      name: 'swc_by_image',
      fields: ['image']
    }]
  })

  await swcDao.sync()

  await swcDao.findOrCreate({
    where: {image: initImage},
    defaults: {
      username: initUser,
      image: initImage,
      swc: initSwc,
      comments: 'autogeneration'
    }
  })
  return swcDao
}

export default async function () {
  const swcRouter = express.Router()
  const swcDao = await initSwcInfo()
  swcRouter.get('/swcs/:image', (req, res) => {
    swcDao.findAll({
      where: {
        image: req.params.image
      }
    }).then((images) => {
      res.send(images)
    })
  })

  return swcRouter
}
