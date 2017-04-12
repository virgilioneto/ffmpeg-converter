'use strict'
const {spawn, execFile} = require('child_process');

class Process {

  static spawn (callback, application, ...args) {
    let stdout = '';
    let stderr = '';
    let execution = spawn(application, args);
    console.log(`Process execution started: ${application}`)
    execution.stdin.once('error', (error) => {
      handleError(`Process execution error: ${application}`, callback, args, error)
    });
    execution.on('error', (error) => {
      handleError(`Process execution error: ${application}`, callback, args, error)
    });
    execution.stdout.on('data', (data) => {
      stdout += data;
      console.log(data)
    });
    execution.stderr.on('data', (data) => {
      stderr += data;
    });
    execution.on('close', (code, signal) => {
      if (code !== 0 || signal !== null) {
        handleError(`Process execution error: ${application}`, callback, args, stderr || stdout)
      } else {
        console.log(stdout)
        console.log(`Process execution finished: ${application}`)
        next(callback)
      }
    });
  }
}

function handleError (message, callback, args, error) {
  console.error(message, ...args, error)
  next(
    callback,
    error instanceof Error
      ? error
      : new Error(error)
  )
}

function next (callback, ...data) {
  callback && typeof callback === 'function' && callback(...data)
}

module.exports = Process