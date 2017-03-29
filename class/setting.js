'use strict';
const STORAGE_KEY = 'SETTING'
let storedData = {}

class Setting {

  static load () {
    let raw = window.localStorage.getItem(STORAGE_KEY)
    storedData = JSON.parse(raw) || {}
  }

  static save () {
    let raw = JSON.stringify(storedData)
    window.localStorage.setItem(STORAGE_KEY, raw)
  }

  static getProperty (key) {
    return storedData[key]
  }
  
  static setProperty (key, value, write = true) {
    storedData[key] = value
    write && Setting.save()
  }
}

module.exports = Setting