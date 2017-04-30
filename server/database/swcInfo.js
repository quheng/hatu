import express from 'express'
import Sequelize from 'sequelize'
import path from 'path'
import fs from 'fs'
import uuid from 'uuid'

import database from './database'

import { spawn } from 'child_process'
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

  swcRouter.get('/swc/trace/:image', (req, res) => {
    const {x, y, z} = req.query
    const image = req.params.name
    const temFileName = uuid.v4()
    const neutu = spawn(process.env.NEUTU_COMMAND, [
      '--command',
      '--trace',
      `http:0.0.0.0:${process.env.DVID_PORT}:${image}:grayscale`, // todo use dvid host
      `--position`,
      x,
      y,
      z,
      `--scale`,
      '1',
      '-o',
      temFileName
    ])
    const filePath = path.join(__dirname, '..', 'tem', temFileName)
    neutu.on('close', (code) => {
      if (code !== 0 || !fs.existsSync(filePath)) {
        res.sendStatus(400)
      } else {
        res.sendFile(filePath)
      }
    })
  })

  return swcRouter
}
