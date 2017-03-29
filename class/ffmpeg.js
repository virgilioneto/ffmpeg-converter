'use strict'
const path = require('path')
const async = require('async')
const Setting = require('./setting')
const Process = require('./process')

class FFMPEG {

  static convert (callback, sourceFile, toExtension = '.mp4', extraArgs = ['-y', '-v', 'error', '-c', 'copy', '-copyts']) {
    let fromPath = `${Setting.getProperty('fromDir')}/${sourceFile}`
    let toPath = `${Setting.getProperty('toDir')}/${sourceFile}`
    let params = ['-i', fromPath].concat(extraArgs)
    let ffmpegDir = Setting.getProperty('ffmpegDir')
    toPath = toPath.replace(path.extname(toPath), toExtension)
    params.push(toPath)
    Process.spawn(callback, `${ffmpegDir}/ffmpeg.exe`, ...params)
  }

  static batchConvert (callback, sourceFileList, toExtension = '.mp4', extraArgs = ['-y', '-v', 'error', '-c', 'copy', '-copyts']) {
    let queue = sourceFileList.map(sourceFile => next => FFMPEG.convert(next, sourceFile, toExtension, extraArgs))

    async.series(queue, callback)
  }
}

module.exports = FFMPEG
