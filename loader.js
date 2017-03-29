'use strict'
const Electron = require('electron')
const Authentication = require('./class/auth0')
const Setting = require('./class/setting')
const FFMPEG = require('./class/ffmpeg')

const {dialog} = Electron.remote

global.BIN_PATH = `${__dirname}/bin`
window.jQuery = require('./node_modules/jquery/dist/jquery.min')
Authentication.init()
Setting.load()
