'use strict'
const EventEmitter = require('events');
const os = require('os')
const path = require('path')
const fs = require('fs')
const async = require('async')
const mkdirp = require('mkdirp')
const Setting = require('./setting')
const Process = require('./process')

class FFMPEG {

  static convert (sourceFileList, toExtension = '.mp4', extraArgs = ['-y', '-v', 'error', '-c', 'copy', '-copyts']) {
    let emitter = new EventEmitter()
    let queue = sourceFileList.map(sourceFile => next => convertFile(next, sourceFile, toExtension, extraArgs, emitter))
    emitter.total = sourceFileList.length
    emitter.success = 0
    emitter.error = 0

    process.nextTick(() => {
      async.series(queue)
    })

    return emitter
  }
}

function convertFile (callback, sourceFile, toExtension = '.mp4', extraArgs = ['-y', '-v', 'error', '-c', 'copy', '-copyts'], emitter) {
  let fromPath = `${Setting.getProperty('fromDir')}/${sourceFile.name}`
  let params = ['-i', fromPath].concat(extraArgs)
  let ffmpegDir = Setting.getProperty('ffmpegDir')
  getToPath(sourceFile.name, toExtension, (toPath) => {
    params.push(toPath)
    Process.spawn((error) => {
      if (error) emit(emitter, 'error', {file: sourceFile, message: error.message})
      else emit(emitter, 'success', {file: sourceFile, message: 'File converted successfully'})
      callback()
    }, `${ffmpegDir}/ffmpeg.exe`, ...params)
  })
}

function getToPath (sourceFile, toExtension, next) {
  let toPath = ''
  if (Setting.getProperty('saveToSource')) next(`${Setting.getProperty('fromDir')}/${sourceFile}`.replace(path.extname(sourceFile), toExtension))
  else if (!Setting.getProperty('saveToSource') && !Setting.getProperty('keepStructure')) next(`${Setting.getProperty('toDir')}/${path.basename(sourceFile)}`.replace(path.extname(sourceFile), toExtension))
  else if (!Setting.getProperty('saveToSource') && Setting.getProperty('keepStructure')) {
    toPath = `${Setting.getProperty('toDir')}/${path.dirname(sourceFile)}`

    fs.stat(toPath, (error) => {
      if (error && error.code === 'ENOENT') {
        mkdirp.sync(toPath, '0777')
      }
      next(path.join(toPath, path.basename(sourceFile)).replace(path.extname(sourceFile), toExtension))
    })
  }
}

function emit (emitter, event, data) {
  emitter.total -= 1
  if (event === 'success') emitter.success += 1
  else emitter.error += 1
  emitter.emit(event, data)

  if (emitter.total <= 0) emitter.emit('finish', {success: emitter.success, error: emitter.error})
}

module.exports = FFMPEG
